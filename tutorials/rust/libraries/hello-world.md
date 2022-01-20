[oliverforral.com](../../..) -> [tutorials](../..) -> [Rust](..) -> [libraries](.) -> Hello World

# Hello World

## Testing empty input

### Red

#### hello-world/src/lib.rs

```rust
#[cfg(test)]
mod greet_should {
    #[test]
    fn return_hello_world_with_name_arg_empty_string() {
        let expected = "Hello, world!";

        let actual = greet("");
    }
}

```

#### cargo watch -x fmt -x check -x "clippy -- -D warnings" -x test;

```bash
[Running 'cargo fmt && cargo check && cargo clippy -- -D warnings && cargo test']
    Checking hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished dev [unoptimized + debuginfo] target(s) in 0.12s
    Checking hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished dev [unoptimized + debuginfo] target(s) in 0.28s
   Compiling hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
error[E0425]: cannot find function `greet` in this scope
 --> src/lib.rs:7:22
  |
7 |         let actual = greet("");
  |                      ^^^^^ not found in this scope

For more information about this error, try `rustc --explain E0425`.
error: could not compile `hello-world` due to previous error
[Finished running. Exit status: 101]
```

### Green

#### hello-world/src/lib.rs

```rust
#[cfg(test)]
mod greet_should {
    use crate::greet;

    #[test]
    fn return_hello_world_with_name_arg_empty_string() {
        let _expected = "Hello, world!";

        let _actual = greet("".to_string());
    }
}

pub fn greet(name: String) -> String {
    name
}

```

#### cargo watch -x fmt -x check -x "clippy -- -D warnings" -x test;

```bash
[Running 'cargo fmt && cargo check && cargo clippy -- -D warnings && cargo test']
    Checking hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished dev [unoptimized + debuginfo] target(s) in 0.11s
    Checking hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished dev [unoptimized + debuginfo] target(s) in 0.26s
   Compiling hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished test [unoptimized + debuginfo] target(s) in 0.81s
     Running unittests (target/debug/deps/hello_world-dba10d19a6c725fe)

running 1 test
test greet_should::return_hello_world_with_name_arg_empty_string ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

   Doc-tests hello-world

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

[Finished running. Exit status: 0]
```

### Refactor

#### hello-world/src/lib.rs

```rust
#[cfg(test)]
mod greet_should {
    use crate::greet;

    #[test]
    fn return_hello_world_with_name_arg_empty_string() {
        let _expected = "Hello, world!".to_owned();

        let _actual = greet("".to_owned());
    }
}

pub fn greet(name: String) -> String {
    name
}

```

#### cargo watch -x fmt -x check -x "clippy -- -D warnings" -x test;

```bash
[Running 'cargo fmt && cargo check && cargo clippy -- -D warnings && cargo test']
    Checking hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished dev [unoptimized + debuginfo] target(s) in 0.12s
    Checking hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished dev [unoptimized + debuginfo] target(s) in 0.25s
   Compiling hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished test [unoptimized + debuginfo] target(s) in 0.71s
     Running unittests (target/debug/deps/hello_world-dba10d19a6c725fe)

running 1 test
test greet_should::return_hello_world_with_name_arg_empty_string ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

   Doc-tests hello-world

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

[Finished running. Exit status: 0]
```

### Red

#### hello-world/src/lib.rs

```rust
#[cfg(test)]
mod greet_should {
    use crate::greet;

    #[test]
    fn return_hello_world_with_name_arg_empty_string() {
        let expected = "Hello, world!".to_owned();

        let actual = greet("".to_owned());

        assert_eq!(actual, expected);
    }
}

pub fn greet(name: String) -> String {
    name
}

```

#### cargo watch -x fmt -x check -x "clippy -- -D warnings" -x test;

```bash
[Running 'cargo fmt && cargo check && cargo clippy -- -D warnings && cargo test']
    Checking hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished dev [unoptimized + debuginfo] target(s) in 0.12s
    Checking hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished dev [unoptimized + debuginfo] target(s) in 0.28s
   Compiling hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished test [unoptimized + debuginfo] target(s) in 0.81s
     Running unittests (target/debug/deps/hello_world-dba10d19a6c725fe)

running 1 test
test greet_should::return_hello_world_with_name_arg_empty_string ... FAILED

failures:

---- greet_should::return_hello_world_with_name_arg_empty_string stdout ----
thread 'greet_should::return_hello_world_with_name_arg_empty_string' panicked at 'assertion failed: `(left == right)`
  left: `""`,
 right: `"Hello, world!"`', src/lib.rs:11:9
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace


failures:
    greet_should::return_hello_world_with_name_arg_empty_string

test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

error: test failed, to rerun pass '--lib'
[Finished running. Exit status: 101]
```

### Green

#### hello-world/src/lib.rs

```rust
#[cfg(test)]
mod greet_should {
    use crate::greet;

    #[test]
    fn return_hello_world_with_name_arg_empty_string() {
        let expected = "Hello, world!".to_owned();

        let actual = greet("".to_owned());

        assert_eq!(actual, expected);
    }
}

pub fn greet(_name: String) -> String {
    "Hello, world!".to_owned()
}

```

#### cargo watch -x fmt -x check -x "clippy -- -D warnings" -x test;

```bash
[Running 'cargo fmt && cargo check && cargo clippy -- -D warnings && cargo test']
    Checking hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished dev [unoptimized + debuginfo] target(s) in 0.52s
    Checking hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished dev [unoptimized + debuginfo] target(s) in 0.28s
   Compiling hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished test [unoptimized + debuginfo] target(s) in 0.72s
     Running unittests (target/debug/deps/hello_world-dba10d19a6c725fe)

running 1 test
test greet_should::return_hello_world_with_name_arg_empty_string ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

   Doc-tests hello-world

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

[Finished running. Exit status: 0]
```

### Refactor

Code might not need to be refactored.

### Red

#### hello-world/src/lib.rs

```rust
#[cfg(test)]
mod greet_should {
    use crate::greet;

    #[test]
    fn return_hello_world_with_name_arg_empty_string() {
        let expected = "Hello, world!".to_owned();

        let actual = greet("".to_owned());

        assert_eq!(actual, expected);
    }

    #[test]
    fn return_hello_oliver_with_name_arg_oliver() {
        let expected = "Hello, Oliver!".to_owned();

        let actual = greet("Oliver".to_owned());

        assert_eq!(actual, expected);
    }
}

pub fn greet(_name: String) -> String {
    "Hello, world!".to_owned()
}

```

#### cargo watch -x fmt -x check -x "clippy -- -D warnings" -x test;

```bash
[Running 'cargo fmt && cargo check && cargo clippy -- -D warnings && cargo test']
    Checking hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished dev [unoptimized + debuginfo] target(s) in 0.12s
    Checking hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished dev [unoptimized + debuginfo] target(s) in 0.27s
   Compiling hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished test [unoptimized + debuginfo] target(s) in 0.74s
     Running unittests (target/debug/deps/hello_world-dba10d19a6c725fe)

running 2 tests
test greet_should::return_hello_world_with_name_arg_empty_string ... ok
test greet_should::return_hello_oliver_with_name_arg_oliver ... FAILED

failures:

---- greet_should::return_hello_oliver_with_name_arg_oliver stdout ----
thread 'greet_should::return_hello_oliver_with_name_arg_oliver' panicked at 'assertion failed: `(left == right)`
  left: `"Hello, world!"`,
 right: `"Hello, Oliver!"`', src/lib.rs:20:9
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace


failures:
    greet_should::return_hello_oliver_with_name_arg_oliver

test result: FAILED. 1 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

error: test failed, to rerun pass '--lib'
[Finished running. Exit status: 101]
```

### Green

#### hello-world/src/lib.rs

```rust
#[cfg(test)]
mod greet_should {
    use crate::greet;

    #[test]
    fn return_hello_world_with_name_arg_empty_string() {
        let expected = "Hello, world!".to_owned();

        let actual = greet("".to_owned());

        assert_eq!(actual, expected);
    }

    #[test]
    fn return_hello_oliver_with_name_arg_oliver() {
        let expected = "Hello, Oliver!".to_owned();

        let actual = greet("Oliver".to_owned());

        assert_eq!(actual, expected);
    }
}

pub fn greet(name: String) -> String {
    if name.is_empty() {
        "Hello, world!".to_owned()
    } else {
        "Hello, Oliver!".to_owned()
    }
}

```

#### cargo watch -x fmt -x check -x "clippy -- -D warnings" -x test;

```bash
[Running 'cargo fmt && cargo check && cargo clippy -- -D warnings && cargo test']
    Checking hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished dev [unoptimized + debuginfo] target(s) in 0.11s
    Finished dev [unoptimized + debuginfo] target(s) in 0.22s
    Finished test [unoptimized + debuginfo] target(s) in 0.36s
     Running unittests (target/debug/deps/hello_world-dba10d19a6c725fe)

running 2 tests
test greet_should::return_hello_oliver_with_name_arg_oliver ... ok
test greet_should::return_hello_world_with_name_arg_empty_string ... ok

test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

   Doc-tests hello-world

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

[Finished running. Exit status: 0]
```

### Refactor

#### hello-world/src/lib.rs

```rust
#[cfg(test)]
mod greet_should {
    use crate::greet;

    #[test]
    fn return_hello_world_with_name_arg_empty_string() {
        let expected = "Hello, world!".to_owned();

        let actual = greet("".to_owned());

        assert_eq!(actual, expected);
    }

    #[test]
    fn return_hello_oliver_with_name_arg_oliver() {
        let expected = "Hello, Oliver!".to_owned();

        let actual = greet("Oliver".to_owned());

        assert_eq!(actual, expected);
    }
}

pub fn greet(name: String) -> String {
    if name.is_empty() {
        return "Hello, world!".to_owned();
    }

    "Hello, Oliver!".to_owned()
}

```

#### cargo watch -x fmt -x check -x "clippy -- -D warnings" -x test;

```bash
[Running 'cargo fmt && cargo check && cargo clippy -- -D warnings && cargo test']
    Checking hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished dev [unoptimized + debuginfo] target(s) in 0.12s
    Checking hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished dev [unoptimized + debuginfo] target(s) in 0.31s
   Compiling hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished test [unoptimized + debuginfo] target(s) in 0.71s
     Running unittests (target/debug/deps/hello_world-dba10d19a6c725fe)

running 2 tests
test greet_should::return_hello_oliver_with_name_arg_oliver ... ok
test greet_should::return_hello_world_with_name_arg_empty_string ... ok

test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

   Doc-tests hello-world

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

[Finished running. Exit status: 0]
```

### Red

#### hello-world/src/lib.rs

```rust
#[cfg(test)]
mod greet_should {
    use crate::greet;

    #[test]
    fn return_hello_world_with_name_arg_empty_string() {
        let expected = "Hello, world!".to_owned();

        let actual = greet("".to_owned());

        assert_eq!(actual, expected);
    }

    #[test]
    fn return_hello_oliver_with_name_arg_oliver() {
        let expected = "Hello, Oliver!".to_owned();

        let actual = greet("Oliver".to_owned());

        assert_eq!(actual, expected);
    }

    #[test]
    fn return_hello_karinna_with_name_arg_karinna() {
        let expected = "Hello, Karinna!".to_owned();

        let actual = greet("Karinna".to_owned());

        assert_eq!(actual, expected);
    }
}

pub fn greet(name: String) -> String {
    if name.is_empty() {
        return "Hello, world!".to_owned();
    }

    "Hello, Oliver!".to_owned()
}

```

#### cargo watch -x fmt -x check -x "clippy -- -D warnings" -x test;

```bash
[Running 'cargo fmt && cargo check && cargo clippy -- -D warnings && cargo test']
    Checking hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished dev [unoptimized + debuginfo] target(s) in 0.12s
    Checking hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished dev [unoptimized + debuginfo] target(s) in 0.30s
   Compiling hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished test [unoptimized + debuginfo] target(s) in 0.85s
     Running unittests (target/debug/deps/hello_world-dba10d19a6c725fe)

running 3 tests
test greet_should::return_hello_oliver_with_name_arg_oliver ... ok
test greet_should::return_hello_karinna_with_name_arg_karinna ... FAILED
test greet_should::return_hello_world_with_name_arg_empty_string ... ok

failures:

---- greet_should::return_hello_karinna_with_name_arg_karinna stdout ----
thread 'greet_should::return_hello_karinna_with_name_arg_karinna' panicked at 'assertion failed: `(left == right)`
  left: `"Hello, Oliver!"`,
 right: `"Hello, Karinna!"`', src/lib.rs:29:9
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace


failures:
    greet_should::return_hello_karinna_with_name_arg_karinna

test result: FAILED. 2 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

error: test failed, to rerun pass '--lib'
[Finished running. Exit status: 101]
```

### Green

#### hello-world/src/lib.rs

```rust
#[cfg(test)]
mod greet_should {
    use crate::greet;

    #[test]
    fn return_hello_world_with_name_arg_empty_string() {
        let expected = "Hello, world!".to_owned();

        let actual = greet("".to_owned());

        assert_eq!(actual, expected);
    }

    #[test]
    fn return_hello_oliver_with_name_arg_oliver() {
        let expected = "Hello, Oliver!".to_owned();

        let actual = greet("Oliver".to_owned());

        assert_eq!(actual, expected);
    }

    #[test]
    fn return_hello_karinna_with_name_arg_karinna() {
        let expected = "Hello, Karinna!".to_owned();

        let actual = greet("Karinna".to_owned());

        assert_eq!(actual, expected);
    }
}

pub fn greet(name: String) -> String {
    if name.is_empty() {
        return "Hello, world!".to_owned();
    }

    format!("Hello, {name}!")
}

```

#### cargo watch -x fmt -x check -x "clippy -- -D warnings" -x test;

```bash
[Running 'cargo fmt && cargo check && cargo clippy -- -D warnings && cargo test']
    Checking hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished dev [unoptimized + debuginfo] target(s) in 0.12s
    Checking hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished dev [unoptimized + debuginfo] target(s) in 0.27s
   Compiling hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished test [unoptimized + debuginfo] target(s) in 0.82s
     Running unittests (target/debug/deps/hello_world-dba10d19a6c725fe)

running 3 tests
test greet_should::return_hello_oliver_with_name_arg_oliver ... ok
test greet_should::return_hello_karinna_with_name_arg_karinna ... ok
test greet_should::return_hello_world_with_name_arg_empty_string ... ok

test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

   Doc-tests hello-world

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

[Finished running. Exit status: 0]
```

### Refactor

Code might not need to be refactored.

### Red

#### hello-world/src/lib.rs

```rust
#[cfg(test)]
mod greet_should {
    use crate::greet;

    #[test]
    fn return_hello_world_with_name_arg_empty_string() {
        let expected = "Hello, world!".to_owned();

        let actual = greet("".to_owned());

        assert_eq!(actual, expected);
    }

    #[test]
    fn return_hello_oliver_with_name_arg_oliver() {
        let expected = "Hello, Oliver!".to_owned();

        let actual = greet("Oliver".to_owned());

        assert_eq!(actual, expected);
    }

    #[test]
    fn return_hello_karinna_with_name_arg_karinna() {
        let expected = "Hello, Karinna!".to_owned();

        let actual = greet("Karinna".to_owned());

        assert_eq!(actual, expected);
    }

    #[test]
    fn return_hello_world_with_name_arg_whitespace_only() {
        let expected = "Hello, world!".to_owned();

        let actual = greet("    ".to_owned());

        assert_eq!(actual, expected);
    }
}

pub fn greet(name: String) -> String {
    if name.is_empty() {
        return "Hello, world!".to_owned();
    }

    format!("Hello, {name}!")
}

```

#### cargo watch -x fmt -x check -x "clippy -- -D warnings" -x test;

```bash
[Running 'cargo fmt && cargo check && cargo clippy -- -D warnings && cargo test']
    Checking hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished dev [unoptimized + debuginfo] target(s) in 0.13s
    Checking hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished dev [unoptimized + debuginfo] target(s) in 0.25s
   Compiling hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished test [unoptimized + debuginfo] target(s) in 0.81s
     Running unittests (target/debug/deps/hello_world-dba10d19a6c725fe)

running 4 tests
test greet_should::return_hello_oliver_with_name_arg_oliver ... ok
test greet_should::return_hello_karinna_with_name_arg_karinna ... ok
test greet_should::return_hello_world_with_name_arg_empty_string ... ok
test greet_should::return_hello_world_with_name_arg_whitespace_only ... FAILED

failures:

---- greet_should::return_hello_world_with_name_arg_whitespace_only stdout ----
thread 'greet_should::return_hello_world_with_name_arg_whitespace_only' panicked at 'assertion failed: `(left == right)`
  left: `"Hello,     !"`,
 right: `"Hello, world!"`', src/lib.rs:38:9
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace


failures:
    greet_should::return_hello_world_with_name_arg_whitespace_only

test result: FAILED. 3 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

error: test failed, to rerun pass '--lib'
[Finished running. Exit status: 101]
```

### Green

#### hello-world/src/lib.rs

```rust
#[cfg(test)]
mod greet_should {
    use crate::greet;

    #[test]
    fn return_hello_world_with_name_arg_empty_string() {
        let expected = "Hello, world!".to_owned();

        let actual = greet("".to_owned());

        assert_eq!(actual, expected);
    }

    #[test]
    fn return_hello_oliver_with_name_arg_oliver() {
        let expected = "Hello, Oliver!".to_owned();

        let actual = greet("Oliver".to_owned());

        assert_eq!(actual, expected);
    }

    #[test]
    fn return_hello_karinna_with_name_arg_karinna() {
        let expected = "Hello, Karinna!".to_owned();

        let actual = greet("Karinna".to_owned());

        assert_eq!(actual, expected);
    }

    #[test]
    fn return_hello_world_with_name_arg_whitespace_only() {
        let expected = "Hello, world!".to_owned();

        let actual = greet("    ".to_owned());

        assert_eq!(actual, expected);
    }
}

pub fn greet(name: String) -> String {
    let name = name.trim();

    if name.is_empty() {
        return "Hello, world!".to_owned();
    }

    format!("Hello, {name}!")
}

```

#### cargo watch -x fmt -x check -x "clippy -- -D warnings" -x test;

```bash
[Running 'cargo fmt && cargo check && cargo clippy -- -D warnings && cargo test']
    Checking hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished dev [unoptimized + debuginfo] target(s) in 0.12s
    Checking hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished dev [unoptimized + debuginfo] target(s) in 0.28s
   Compiling hello-world v0.1.0 (/home/intrepion/code/github/intrepion/rust-lib-named-hello-world/hello-world)
    Finished test [unoptimized + debuginfo] target(s) in 0.91s
     Running unittests (target/debug/deps/hello_world-dba10d19a6c725fe)

running 4 tests
test greet_should::return_hello_karinna_with_name_arg_karinna ... ok
test greet_should::return_hello_oliver_with_name_arg_oliver ... ok
test greet_should::return_hello_world_with_name_arg_empty_string ... ok
test greet_should::return_hello_world_with_name_arg_whitespace_only ... ok

test result: ok. 4 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

   Doc-tests hello-world

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

[Finished running. Exit status: 0]
```

### Refactor

Code might not need to be refactored.
