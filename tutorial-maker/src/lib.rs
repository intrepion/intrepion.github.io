#[cfg(test)]
mod get_repos_should {
    use super::*;

    #[test]
    fn return_repos_with_app_name_hello_world_and_language_rust_and_program_type_lib_and_user_intrepion(
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

    #[test]
    fn return_repos_with_app_name_fizz_buzz_and_language_rust_and_program_type_lib_and_user_intrepion() {
        let expected = vec![GitHubRepository {
            app_name: "fizz-buzz-library".to_string(),
            client_type: None,
            language: ProgrammingLanguage::Rust,
            program_type: ProgramType::Library,
            server_type: None,
            user: "intrepion".to_string(),
        }];

        let actual = get_repos(
            "intrepion",
            "fizz-buzz",
            ProgrammingLanguage::Rust,
            ProgramType::Library,
        );

        assert_eq!(actual, expected);
    }

    #[test]
    fn return_repos_with_app_name_hello_world_and_language_typescript_and_program_type_lib_and_user_intrepion(
    ) {
        let expected = vec![GitHubRepository {
            app_name: "hello-world-library".to_string(),
            client_type: None,
            language: ProgrammingLanguage::TypeScript,
            program_type: ProgramType::Library,
            server_type: None,
            user: "intrepion".to_string(),
        }];

        let actual = get_repos(
            "intrepion",
            "hello-world",
            ProgrammingLanguage::TypeScript,
            ProgramType::Library,
        );

        assert_eq!(actual, expected);
    }
}

#[derive(Debug, PartialEq)]
enum ProgrammingLanguage {
    Rust,
}

#[derive(Debug, PartialEq)]
enum ProgramType {
    Library,
}

#[derive(Debug, PartialEq)]
struct GitHubRepository {
    app_name: String,
    client_type: Option<String>,
    language: ProgrammingLanguage,
    program_type: ProgramType,
    server_type: Option<String>,
    user: String,
}

fn get_repos(user: &str, app_name: &str, language: ProgrammingLanguage, program_type: ProgramType) -> Vec<GitHubRepository> {
    vec![GitHubRepository {
        app_name: format!("{app_name}-library"),
        client_type: None,
        language: ProgrammingLanguage::Rust,
        program_type: ProgramType::Library,
        server_type: None,
        user: "intrepion".to_string()
    }]
}
