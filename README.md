# Twitter Clone (Rails + React)

Twitter ライクな SNS アプリケーションのモノレポプロジェクトです。バックエンドは Ruby on Rails、フロントエンドは React + Vite で構築されています。

## プロジェクト構成

このプロジェクトはモノレポ構成を採用しています：

- `backend/` - Ruby on Rails バックエンドアプリケーション
- `frontend/` - React + Vite フロントエンドアプリケーション
- `.github/workflows/` - CI/CD のための GitHub Actions ワークフロー

## 開発環境のセットアップ

### 前提条件

- Docker と Docker Compose
- Node.js 18 以上
- Ruby 3.2.2

### バックエンドのセットアップ

```bash
cd backend
bundle install
docker-compose up -d
rails db:create db:migrate db:seed
rails s
```

### フロントエンドのセットアップ

```bash
cd frontend
npm install
npm run dev
```

## AWS 構成と手動デプロイ手順

### AWS 構成概要

この Twitter クローンアプリケーションは、以下の AWS 構成でデプロイします：

#### バックエンド (Rails)

- **ECR (Elastic Container Registry)**
  - Rails アプリケーションのコンテナイメージを保存
- **ECS Fargate**
  - サーバーレスでコンテナを実行
  - オートスケーリング可能
- **Application Load Balancer (ALB)**
  - HTTP リクエストの負荷分散
  - ヘルスチェック対応
- **RDS (PostgreSQL)**
  - データベース

#### フロントエンド (React)

- **S3**
  - 静的ウェブサイトとしての React ビルドファイルの保存
- **CloudFront**
  - グローバル CDN でコンテンツ配信
  - SSL 対応
  - キャッシュ機能

#### セキュリティ・モニタリング

- **IAM**
  - ECS タスク実行ロール
  - デプロイ用のアクセスキー
- **CloudWatch**
  - ログ・メトリクス監視
- **Systems Manager Parameter Store**
  - 機密情報の安全な保存

### 手動デプロイ手順

#### 1. AWS アカウントと IAM ユーザーの設定

1. AWS アカウントを作成
2. 管理者権限を持つ IAM ユーザーを作成
3. アクセスキーとシークレットキーを取得して安全に保存

#### 2. バックエンドのデプロイ準備

1. **ECR リポジトリの作成**

   ```bash
   aws ecr create-repository --repository-name twitter-clone-backend --image-scanning-configuration scanOnPush=true
   ```

2. **RDS インスタンスの作成**

   - AWS コンソールで RDS PostgreSQL インスタンスを作成
   - セキュリティグループで ECS からのアクセスを許可

3. **Systems Manager Parameter Store に機密情報を保存**

   - Rails の`RAILS_MASTER_KEY`を保存

   ```bash
   aws ssm put-parameter --name "/twitter-clone/RAILS_MASTER_KEY" --type "SecureString" --value "実際のmaster.keyの値"
   ```

4. **ECS クラスターの作成**

   ```bash
   aws ecs create-cluster --cluster-name twitter-clone-cluster
   ```

5. **ALB の作成**

   - AWS コンソールで ALB を作成
   - ターゲットグループを作成（ポート 3000、ヘルスチェックパス: `/health`）
   - セキュリティグループ設定（HTTP 80 ポート開放）

6. **IAM ロールの設定**
   - ECS 実行ロールを作成し、ECR/CloudWatch へのアクセス権限を付与
   - SSM パラメータ読み取り権限を付与

#### 3. フロントエンドのデプロイ準備

1. **S3 バケットの作成**

   ```bash
   aws s3 mb s3://twitter-clone-frontend
   ```

2. **S3 の静的ウェブサイト設定**

   ```bash
   aws s3 website s3://twitter-clone-frontend --index-document index.html --error-document index.html
   ```

3. **S3 バケットポリシーの設定**

   ```bash
   aws s3api put-bucket-policy --bucket twitter-clone-frontend --policy file://bucket-policy.json
   ```

   bucket-policy.json:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::twitter-clone-frontend/*"
       }
     ]
   }
   ```

4. **CloudFront ディストリビューションの作成**
   - AWS コンソールで S3 をオリジンとする CloudFront ディストリビューションを作成
   - デフォルトルートオブジェクト: `index.html`
   - カスタムエラーレスポンス: 404→200, /index.html

#### 4. バックエンドのデプロイ

1. **Docker イメージのビルド**

   ```bash
   cd backend
   docker build -t twitter-clone-backend .
   ```

2. **ECR へのログインとイメージのプッシュ**

   ```bash
   aws ecr get-login-password | docker login --username AWS --password-stdin <アカウントID>.dkr.ecr.<リージョン>.amazonaws.com
   docker tag twitter-clone-backend:latest <アカウントID>.dkr.ecr.<リージョン>.amazonaws.com/twitter-clone-backend:latest
   docker push <アカウントID>.dkr.ecr.<リージョン>.amazonaws.com/twitter-clone-backend:latest
   ```

3. **ECS タスク定義の作成**

   - AWS コンソールでタスク定義を作成
   - Fargate タイプ、CPU: 256, メモリ: 512MB
   - コンテナ定義：
     - イメージ: ECR リポジトリの URI
     - ポートマッピング: 3000:3000
     - 環境変数:
       - RAILS_ENV=production
       - DATABASE_URL=<RDS の URL>
     - シークレット:
       - RAILS_MASTER_KEY: SSM パラメータからの参照

4. **ECS サービスの作成**
   - タスク定義を使用してサービスを作成
   - デザイアドカウント: 1
   - ALB と関連付け

#### 5. フロントエンドのデプロイ

1. **フロントエンドのビルド**

   ```bash
   cd frontend
   # バックエンドAPIのURLを環境変数に設定
   export VITE_API_BASE_URL=https://<ALB_DNS_NAME>
   npm ci
   npm run build
   ```

2. **S3 へのデプロイ**

   ```bash
   aws s3 sync dist/ s3://twitter-clone-frontend --delete
   ```

3. **CloudFront キャッシュの無効化**
   ```bash
   aws cloudfront create-invalidation --distribution-id <DISTRIBUTION_ID> --paths "/*"
   ```

### GitHub Secrets の設定

GitHub Actions を使用した自動デプロイのために以下のシークレットを設定:

1. `AWS_ACCESS_KEY_ID`: AWS アクセスキー
2. `AWS_SECRET_ACCESS_KEY`: AWS シークレットキー
3. `AWS_REGION`: AWS リージョン（例: ap-northeast-1）
4. `ECR_REPOSITORY_BACKEND`: ECR リポジトリ名
5. `ECS_CLUSTER`: ECS クラスター名
6. `ECS_SERVICE_BACKEND`: ECS サービス名
7. `S3_BUCKET`: フロントエンドの S3 バケット名
8. `CLOUDFRONT_DISTRIBUTION_ID`: CloudFront ディストリビューション ID
9. `VITE_API_BASE_URL`: バックエンド API の URL

## モノレポへの移行手順

既存の別々のリポジトリからモノレポに移行するには：

1. 新しいルートディレクトリを作成

   ```bash
   mkdir twitter_clone_rails_react
   cd twitter_clone_rails_react
   git init
   ```

2. 既存のリポジトリから必要なファイルをコピー

   ```bash
   # バックエンドファイルのコピー
   cp -r /path/to/backend_repo/* ./backend/
   rm -rf ./backend/.git

   # フロントエンドファイルのコピー
   cp -r /path/to/frontend_repo/* ./frontend/
   rm -rf ./frontend/.git
   ```

3. ルートの.gitignore ファイルを作成（既に作成済み）

4. 変更をコミット

   ```bash
   git add .
   git commit -m "Initial commit for monorepo"
   ```

5. リモートリポジトリを設定
   ```bash
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

## ライセンス

MIT
