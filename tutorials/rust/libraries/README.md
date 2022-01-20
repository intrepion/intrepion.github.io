[oliverforral.com](../../..) -> [tutorials](../..) -> [Rust](..) -> libraries

# libraries

## First steps before each tutorial

### .gitignore

```gitignore
**/target/
Cargo.lock
**/*.rs.bk

```

### bash

```bash
cargo new --lib project-name;
```

### bash output

```bash
     Created library `project-name` package
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
      run: cd hello-world && cargo fmt -- --check
    - name: Check
      run: cd hello-world && cargo check
    - name: Run tests
      run: cd hello-world && cargo test --verbose

```

### bash

```bash
cd project-name/;
cargo watch -x fmt -x check -x "clippy -- -D warnings" -x test;
```

### bash output

```bash
[Running 'cargo fmt && cargo check && cargo clippy -- -D warnings && cargo test']
    Checking project-name v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/project-name)
    Finished dev [unoptimized + debuginfo] target(s) in 0.47s
    Checking project-name v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/project-name)
    Finished dev [unoptimized + debuginfo] target(s) in 0.24s
   Compiling project-name v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/project-name)
    Finished test [unoptimized + debuginfo] target(s) in 0.76s
     Running unittests (target/debug/deps/project_name-0123456789abcdef)

running 1 test
test tests::it_works ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

   Doc-tests project-name

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

[Finished running. Exit status: 0]
[Running 'cargo fmt && cargo check && cargo clippy -- -D warnings && cargo test']
    Finished dev [unoptimized + debuginfo] target(s) in 0.00s
    Finished dev [unoptimized + debuginfo] target(s) in 0.21s
    Finished test [unoptimized + debuginfo] target(s) in 0.37s
     Running unittests (target/debug/deps/project_name-0123456789abcdef)

running 1 test
test tests::it_works ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

   Doc-tests project-name

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

[Finished running. Exit status: 0]
```

- [Hello World](hello-world)
