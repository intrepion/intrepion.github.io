#[cfg(test)]
mod get_repos_should {
    use super::*;

    #[test]
    fn return_repos_with_app_name_hello_world_library_and_language_rust_and_program_type_lib_and_user_intrepion(
    ) {
        let expected = vec![GitHubRepository {
            app_name: "hello-world-library".to_string(),
            client_type: None,
            language: ProgrammingLanguage::Rust,
            program_type: ProgramType::Library,
            server_type: None,
            user: "intrepion".to_string(),
        }];

        let actual = get_repos(
            "intrepion",
            "hello-world",
            ProgrammingLanguage::Rust,
            ProgramType::Library,
        );

        assert_eq!(actual, expected);
    }
}

enum ProgrammingLanguage {
    Rust,
}

enum ProgramType {
    Library,
}

struct GitHubRepository {
    app_name: String,
    client_type: Option<String>,
    language: ProgrammingLanguage,
    program_type: ProgramType,
    server_type: Option<String>,
    user: String,
}

fn get_repos(user: &str, app_name: &str, language: ProgrammingLanguage, program_type: ProgramType) {
}
