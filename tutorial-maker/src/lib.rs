#[cfg(test)]
mod get_repos_should {
    use super::*;

    #[test]
    fn return_repos_with_language_rust_and_app_name_hello_world_library_and_program_type_lib() {
        let expected = vec![
            Repo {},
        ];
    }
}

struct Repo {}