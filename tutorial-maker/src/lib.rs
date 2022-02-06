#[cfg(test)]
mod get_repos_should {
    use super::*;

    #[test]
    fn return_repos_with_app_name_hello_world_library_and_language_rust_and_program_type_lib_and_user_intrepion(
    ) {
        let expected = vec![GitHubRepository {
            app_name: "hello-world-library".to_string(),
            language: ProgrammingLanguage::Rust,
        }];
    }
}

enum ProgrammingLanguage {
    Rust,
}

struct GitHubRepository {
    app_name: String,
    language: ProgrammingLanguage,
}
