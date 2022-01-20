[oliverforral.com](../..) -> [tutorials](..) -> Rust

# Rust

[https://www.rust-lang.org/](https://www.rust-lang.org/)

## Installation

### Linux

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh;
```

### Helpful Tools

```sh
cargo install cargo-watch;
```

## First steps before each tutorial

```gitignore
# .gitignore

**/target/
**/*.rs.bk
```

```sh
cargo new project-name;
```

```sh
     Created binary (application) `project-name` package
```

```sh
cd project-name;
cargo watch -x check -x t;
```

```sh
[Running 'cargo check && cargo t']
    Checking project-name v0.1.0 (/home/username/code/github/username/repo-name/project-name)
    Finished dev [unoptimized + debuginfo] target(s) in 0.47s
   Compiling project-name v0.1.0 (/home/username/code/github/username/repo-name/project-name)
    Finished test [unoptimized + debuginfo] target(s) in 0.33s
     Running unittests (target/debug/deps/project_name-0123456789abcdef)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

[Finished running. Exit status: 0]
[Running 'cargo check && cargo t']
    Finished dev [unoptimized + debuginfo] target(s) in 0.00s
    Finished test [unoptimized + debuginfo] target(s) in 0.00s
     Running unittests (target/debug/deps/project_name-0123456789abcdef)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

[Finished running. Exit status: 0]
```

## [CLI](cli)
