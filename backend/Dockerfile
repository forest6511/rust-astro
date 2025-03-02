# Rustベースのイメージを使用
FROM rust:latest AS builder

# 必要なツールをインストール
RUN apt-get update && apt-get install -y \
    curl build-essential clang pkg-config libjpeg-turbo-progs libpng-dev \
    libmagickwand-dev libclang-dev && \
    rm -rf /var/lib/apt/lists/*

# ImageMagickのインストール
RUN curl -L https://imagemagick.org/archive/ImageMagick.tar.gz | tar xz \
    && cd ImageMagick-7.1* \
    && ./configure --with-magick-plus-plus=no --with-perl=no \
    && make && make install \
    && cd .. && rm -r ImageMagick-7.1*

# 作業ディレクトリの設定
WORKDIR /app

# `policy.xml` の適用（ImageMagick の権限を調整）
COPY policy.xml /etc/ImageMagick-7/policy.xml

# 必要なファイルをコピー
COPY Cargo.toml Cargo.lock ./
COPY src src
COPY tests tests

# `build.rs` を取得
RUN wget https://raw.githubusercontent.com/nlfiedler/magick-rust/master/build.rs

# Rustのビルド
RUN cargo build --release

# 実行用のユーザーを作成
RUN adduser --disabled-password --gecos '' rust-user
RUN chown -R rust-user /app

# 実行ユーザーを変更
USER rust-user
ENV USER=rust-user

# ポートを公開
EXPOSE 8080

# アプリを実行
CMD ["./target/release/quicktoolify-backend"]
