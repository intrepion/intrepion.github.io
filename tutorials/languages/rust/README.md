[oliverforral.com](../../../README.md) -> [tutorials](../../README.md) -> [languages](../README.md) -> Rust

# Rust

[https://www.rust-lang.org/](https://www.rust-lang.org/)

## Installation

### Linux

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh;
```

### Helpful Tools

```bash
rustup component add clippy;
cargo install cargo-watch;
```

## First steps before each tutorial

### .gitignore

```gitignore
**/target/
Cargo.lock
**/*.rs.bk

```

### bash

```bash
cargo new --lib unique-project-name;
```

### bash output

```bash
     Created library `unique-project-name` package
```

### .github/workflows/rust.yml

```yaml
name: Rust

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

env:
  CARGO_TERM_COLOR: always

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - name: Format
      run: cd unique-project-name && cargo fmt -- --check
    - name: Check
      run: cd unique-project-name && cargo check
    - name: Run tests
      run: cd unique-project-name && cargo test --verbose

```

### README.md

```markdown
![Rust](https://github.com/username/unique-project-name/actions/workflows/rust.yml/badge.svg?branch=main)
```

### bash

```bash
cd unique-project-name/;
cargo watch -x fmt -x check -x "clippy -- -D warnings" -x test;
```

### bash output

```bash
[Running 'cargo fmt && cargo check && cargo clippy -- -D warnings && cargo test']
    Checking unique-project-name v0.1.0 (/home/username/code/github/username/repo-name/unique-project-name)
    Finished dev [unoptimized + debuginfo] target(s) in 0.47s
    Checking unique-project-name v0.1.0 (/home/username/code/github/username/repo-name/unique-project-name)
    Finished dev [unoptimized + debuginfo] target(s) in 0.24s
   Compiling unique-project-name v0.1.0 (/home/username/code/github/username/repo-name/unique-project-name)
    Finished test [unoptimized + debuginfo] target(s) in 0.76s
     Running unittests (target/debug/deps/unique_project_name-0123456789abcdef)

running 1 test
test tests::it_works ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

   Doc-tests unique-project-name

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

[Finished running. Exit status: 0]
[Running 'cargo fmt && cargo check && cargo clippy -- -D warnings && cargo test']
    Finished dev [unoptimized + debuginfo] target(s) in 0.00s
    Finished dev [unoptimized + debuginfo] target(s) in 0.21s
    Finished test [unoptimized + debuginfo] target(s) in 0.37s
     Running unittests (target/debug/deps/unique_project_name-0123456789abcdef)

running 1 test
test tests::it_works ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

   Doc-tests unique-project-name

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

[Finished running. Exit status: 0]
```

## Libraries

- [Hello World library in Rust](../../libraries/hello-world/rust/README.md)
