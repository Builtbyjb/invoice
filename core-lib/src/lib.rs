pub fn add(left: u64, right: u64) -> u64 {
    left + right
}

pub fn say_hello() -> &'static str {
    return "Hello from rust";
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}
