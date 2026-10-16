# Cybersecurity Case Study: SQL Injection (SQLi) Vulnerability & Defense
**Student Guidelines Step 18 (Page 6)**

## 1. What is the Vulnerability?
SQL Injection (SQLi) occurs when untrusted user input is directly concatenated into a dynamic SQL query string without sanitization or parameter binding, allowing an attacker to manipulate the query structure executed by the database engine.

## 2. How Can it Happen?
Consider an authentication query constructed with string concatenation:
`sql
SELECT * FROM users WHERE email = '' AND password = '';
`
If a malicious user submits ' OR '1'='1' -- as the email, the query resolves to:
`sql
SELECT * FROM users WHERE email = '' OR '1'='1' -- AND password = '...';
`
The condition '1'='1' evaluates to true for all rows, bypassing authentication without requiring a valid password.

## 3. What are the Risks?
- **Total Data Exfiltration**: Attackers can read sensitive records (PII, hashed credentials, billing details).
- **Data Tampering & Destruction**: Execution of DROP TABLE, UPDATE, or INSERT commands.
- **Privilege Escalation**: Gaining database administrative access (DBA role).
- **Remote Code Execution**: In misconfigured engines (e.g., xp_cmdshell in MS SQL or INTO OUTFILE in MySQL).

## 4. How Can Developers Prevent It?
- **Prepared Statements (Parameterized Queries)**: Always use parameter markers (? or :param). The database engine compiles query structure first, treating input strictly as data values.
- **Object-Relational Mapping (ORM)**: Use modern ORMs (e.g., Prisma, Hibernate, Entity Framework) that automatically parameterize queries.
- **Input Validation & Typing**: Enforce strict alphanumeric, email, and type checking before processing.

## 5. Security Best Practices
- **Principle of Least Privilege**: Run the database connection under an account restricted only to necessary tables and operations.
- **Password Hashing**: Store passwords hashed using salted Argon2id or Bcrypt, never plaintext.
- **Defense in Depth**: Pair parameterized queries with Web Application Firewalls (WAF) and central audit logging.