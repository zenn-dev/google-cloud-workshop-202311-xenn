
# Cloud Run ハンズオン

## はじめに

説明

## セットアップ（API）

Google Cloud のリソースを操作できるようにするため、以下のコマンドでサービスを有効にします。ハンズオン開始時に一度実行すればOKです。


```sh
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  pubsub.googleapis.com \
  sqladmin.googleapis.com
```

## セットアップ（設定）

Cloud Shell でコマンドを実行するときの設定です。セッションごとにリセットされるため、Cloud Shellを再起動した場合などは、こちらのコマンドを再度実行してください。

### gcloud コマンドの初期化

```sh
gcloud config set run/region asia-northeast1
gcloud config set run/platform managed
```

ここではリージョンを東京、プラットフォームをフルマネージドに設定しました。この設定を行うことで、gcloud コマンドから Cloud Run を操作するときに毎回指定する必要がなくなります。

### 環境変数の設定

```sh
export GITHUB_REPOSITORY_NAME=google-cloud-workshop-202311-xenn
export TF_VAR_gcp_project_id=$GOOGLE_CLOUD_PROJECT
export TF_VAR_primary_region="asia-northeast1"
export CLOUD_SQL_CONNECTION_HOST="/cloudsql/${GOOGLE_CLOUD_PROJECT}:xenn-db"
export XENN_CLOUD_RUN_SERVICE_ACCOUNT="xenn-cloud-run-runner@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com"
```

## Terraform の利用開始

### 初期化

```sh
cd ~/$GITHUB_REPOSITORY_NAME/infra
terraform init
```

### Cloud Run 用 サービスアカウントの設定

まずはこちらのコマンドでサービスアカウントを作成しつつ、Terraformが実行できることを確認します。

```sh
terraform apply -target module.cloud-run
```

- `yes` と入力しEnter
- 警告が表示されますが問題ありません

## データベース（Cloud SQL）の作成

```sh
terraform apply
```

- `yes` と入力しEnter
- 最大10分ほどかかりますのでそのまま待ちます

## チェックポイント

ここまでの状態を整理します。


## データベースユーザーの作成

```bash
gcloud sql users create postgres \
  --instance=xenn-db \
  --password=handson
```

## APIアプリケーションのデプロイ

Ruby on Rails を Cloud Run へデプロイします。



