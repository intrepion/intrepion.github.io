use std::process;
use std::process::Command;
use std::{env, fs};

fn main() {
    let usage = r#"tutorial-maker <username> <program-name> <language> <program-type>

    <language> can only be the following:

    - rust

    <program-type> can only be the following:

    - library
"#;
    let args: Vec<String> = env::args().collect();

    if args.len() < 5 {
        println!("{usage}");

        process::exit(1);
    }

    println!("{:?}", args);

    let username = args[1].to_lowercase();
    let program_name = args[2].to_lowercase();
    let args3 = args[3].to_lowercase();
    let language = if args3 == "rust" {
        "rust"
    } else {
        println!("{usage}");

        process::exit(1);
    };

    let args4 = args[4].to_lowercase();
    let program_type = if args4 == "library" {
        "library"
    } else {
        println!("{usage}");

        process::exit(1);
    };

    let path_name = format!("repos/github/{username}");

    println!("mkdir -p path_name: {path_name}");

    fs::create_dir_all(&path_name).expect("unable to create path name");

    println!("cd {path_name}");

    env::set_current_dir(&path_name).expect("changing directory failed");

    let app_name = format!("{program_name}-{program_type}");
    let folder_name = format!("{program_name}-{language}-{program_type}");
    let repo_name = format!("{username}/{folder_name}");

    println!("rm -rf {folder_name}");

    let removing_folder_output = Command::new("rm")
        .arg("-rf")
        .arg(&folder_name)
        .output()
        .expect("removing folder failed");

    if removing_folder_output.status.success() {
        println!(
            "cloning stdout: {}",
            String::from_utf8_lossy(&removing_folder_output.stdout)
        );
    } else {
        println!(
            "cloning stderr: {}",
            String::from_utf8_lossy(&removing_folder_output.stderr)
        );

        process::exit(1);
    }

    println!("gh repo clone {repo_name}");

    let cloning_output = Command::new("gh")
        .arg("repo")
        .arg("clone")
        .arg(&repo_name)
        .output()
        .expect("cloning failed");

    if cloning_output.status.success() {
        println!(
            "cloning stdout: {}",
            String::from_utf8_lossy(&cloning_output.stdout)
        );
    } else {
        println!(
            "cloning stderr: {}",
            String::from_utf8_lossy(&cloning_output.stderr)
        );

        process::exit(1);
    }

    println!("cd {folder_name}");

    env::set_current_dir(&folder_name).expect("changing directory failed");

    println!("git rev-list --all --reverse");

    let rev_list_output = Command::new("git")
        .arg("rev-list")
        .arg("--all")
        .arg("--reverse")
        .output()
        .expect("rev-list failed");

    if rev_list_output.status.success() {
        let rev_list_output_cow = String::from_utf8_lossy(&rev_list_output.stdout).to_string();

        for (_, commit_hash) in rev_list_output_cow.split("\n").enumerate() {
            if !commit_hash.is_empty() {
                println!("git checkout {commit_hash}");

                let checkout_output = Command::new("git")
                    .arg("checkout")
                    .arg(commit_hash)
                    .output()
                    .expect("checkout failed");

                if checkout_output.status.success() {
                    println!(
                        "checkout stdout: {}",
                        String::from_utf8_lossy(&checkout_output.stdout)
                    );
                } else {
                    println!(
                        "checkout stderr: {}",
                        String::from_utf8_lossy(&checkout_output.stderr)
                    );

                    process::exit(1);
                }

                let mut path = env::current_dir().expect("getting current directory failed");
                path.push(&app_name);
                let metadata = fs::metadata(path);
                match metadata {
                  Ok(_) => {},
                  Err(_) => {
                      continue;
                  }
                };

                println!("cd {app_name}");

                env::set_current_dir(&app_name).expect("changing directory failed");

                println!("cargo test");

                let test_output = Command::new("cargo")
                    .arg("test")
                    .output()
                    .expect("test failed");

                if test_output.status.success() {
                    println!(
                        "test stdout: {}",
                        String::from_utf8_lossy(&test_output.stdout)
                    );
                } else {
                    println!(
                        "test stderr: {}",
                        String::from_utf8_lossy(&test_output.stderr)
                    );

                    process::exit(1);
                }
            }
        }

        println!(
            "rev-list stdout: {}",
            String::from_utf8_lossy(&rev_list_output.stdout)
        );
    } else {
        println!(
            "rev-list stderr: {}",
            String::from_utf8_lossy(&rev_list_output.stderr)
        );

        process::exit(1);
    }
}
