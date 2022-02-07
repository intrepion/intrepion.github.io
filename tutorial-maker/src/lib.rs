#[cfg(test)]
mod new_github_repository_should {
    use super::*;

    #[test]
    fn return_github_repository_with_app_name_hello_world_and_language_rust_and_program_type_library_and_user_intrepion(
    ) {
        let expected = GitHubRepository {
            app_name: "intrepion-hello-world-library".to_owned(),
            client_type: None,
            language: Language::Rust,
            program_type: ProgramType::Library,
            server_type: None,
            user: "intrepion".to_owned(),
        };

        let actual = new_github_repository(
            "intrepion",
            "hello-world",
            Language::Rust,
            ProgramType::Library,
        );

        assert_eq!(actual, expected);
    }

    #[test]
    fn return_github_repository_with_app_name_fizz_buzz_and_language_rust_and_program_type_library_and_user_intrepion(
    ) {
        let expected = GitHubRepository {
            app_name: "intrepion-fizz-buzz-library".to_owned(),
            client_type: None,
            language: Language::Rust,
            program_type: ProgramType::Library,
            server_type: None,
            user: "intrepion".to_owned(),
        };

        let actual = new_github_repository(
            "intrepion",
            "fizz-buzz",
            Language::Rust,
            ProgramType::Library,
        );

        assert_eq!(actual, expected);
    }

    #[test]
    fn return_github_repository_with_app_name_hello_world_and_language_typescript_and_program_type_library_and_user_intrepion(
    ) {
        let expected = GitHubRepository {
            app_name: "intrepion-hello-world-library".to_owned(),
            client_type: None,
            language: Language::TypeScript,
            program_type: ProgramType::Library,
            server_type: None,
            user: "intrepion".to_owned(),
        };

        let actual = new_github_repository(
            "intrepion",
            "hello-world",
            Language::TypeScript,
            ProgramType::Library,
        );

        assert_eq!(actual, expected);
    }

    #[test]
    fn return_github_repository_with_app_name_hello_world_and_language_rust_and_program_type_console_and_user_intrepion(
    ) {
        let expected = GitHubRepository {
            app_name: "intrepion-hello-world-console".to_owned(),
            client_type: None,
            language: Language::Rust,
            program_type: ProgramType::Console,
            server_type: None,
            user: "intrepion".to_owned(),
        };

        let actual = new_github_repository(
            "intrepion",
            "hello-world",
            Language::Rust,
            ProgramType::Console,
        );

        assert_eq!(actual, expected);
    }

    #[test]
    fn return_github_repository_with_app_name_hello_world_and_language_rust_and_program_type_library_and_user_oliverforral(
    ) {
        let expected = GitHubRepository {
            app_name: "oliverforral-hello-world-library".to_owned(),
            client_type: None,
            language: Language::Rust,
            program_type: ProgramType::Library,
            server_type: None,
            user: "oliverforral".to_owned(),
        };

        let actual = new_github_repository(
            "oliverforral",
            "hello-world",
            Language::Rust,
            ProgramType::Library,
        );

        assert_eq!(actual, expected);
    }
}

#[derive(Debug, PartialEq)]
enum Language {
    Rust,
    TypeScript,
}

#[derive(Debug, PartialEq)]
enum ProgramType {
    Console,
    Library,
}

#[derive(Debug, PartialEq)]
struct GitHubRepository {
    app_name: String,
    client_type: Option<String>,
    language: Language,
    program_type: ProgramType,
    server_type: Option<String>,
    user: String,
}

fn new_github_repository(
    user: &str,
    app_name: &str,
    language: Language,
    program_type: ProgramType,
) -> GitHubRepository {
    GitHubRepository {
        app_name: match program_type {
            ProgramType::Library => format!("{user}-{app_name}-library"),
            ProgramType::Console => format!("{user}-{app_name}-console"),
        },
        client_type: None,
        language,
        program_type,
        server_type: None,
        user: user.to_owned(),
    }
}
