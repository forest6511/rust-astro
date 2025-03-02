FROM rust:1.77 as builder

WORKDIR /app

# 依存関係をキャッシュするために空のプロジェクトをコピー
COPY Cargo.toml Cargo.lock ./

# 依存関係だけをビルド
RUN mkdir src && \
    echo "fn main() {}" > src/main.rs && \
    cargo build --release && \
    rm -rf src

# 実際のソースコードをコピー
COPY src ./src

# 再ビルド
RUN touch src/main.rs && cargo build --release

# 最小限の実行環境
FROM debian:bullseye-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ビルド済みのバイナリをコピー
COPY --from=builder /app/target/release/quicktoolify-backend ./

EXPOSE 8080

CMD ["./quicktoolify-backend"]