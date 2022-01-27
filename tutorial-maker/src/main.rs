use std::{env, fs};
use std::process;
use std::process::Command;

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

    println!("making path name: {path_name}");

    fs::create_dir_all(&path_name).expect("unable to create path name");
    env::set_current_dir(&path_name).expect("changing directory failed");

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

    env::set_current_dir(&folder_name).expect("changing directory failed");
}
