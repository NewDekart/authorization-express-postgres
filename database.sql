DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users_to_roles;

CREATE TABLE users (
	user_id int GENERATED ALWAYS AS IDENTITY,
	username varchar(64) UNIQUE NOT NULL,
	password varchar(64) NOT NULL,
	
	CONSTRAINT PK_user_user_id PRIMARY KEY (user_id)
);

CREATE TABLE roles (
	role_id int GENERATED ALWAYS AS IDENTITY,
	name varchar(64) UNIQUE NOT NULL,
	
	CONSTRAINT PK_role_role_id PRIMARY KEY (role_id)
);

CREATE TABLE users_to_roles (
	user_id int,
	role_id int,
	
	CONSTRAINT FK_users_to_roles_users FOREIGN KEY (user_id) REFERENCES users(user_id),
	CONSTRAINT FK_users_to_roles_roles FOREIGN KEY (role_id) REFERENCES roles(role_id),
	UNIQUE (user_id, role_id)
);

ALTER TABLE roles
ALTER COLUMN name SET DEFAULT 'USER';

INSERT INTO roles (name)
VALUES ('USER'), ('ADMIN');