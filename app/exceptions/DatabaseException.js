class DatabaseException extends Error {
    constructor(msg) {
        super(msg);
        this.name = "DatabaseException";
    }
}