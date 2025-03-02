pub mod images;

pub async fn health_check() -> &'static str {
    "OK"
}