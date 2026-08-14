INSERT INTO roles (authority) VALUES ('ROLE_USER');
INSERT INTO roles (authority) VALUES ('ROLE_ADMIN');

INSERT INTO users (name, email, password, profile_picture ) VALUES ('Vinicius', 'viniciussironi@gmail.com', '$2a$10$eACCYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORUYzfMQCbVBIhZ8tG', 'default-profile.png');

INSERT INTO user_roles (user_id, role_id) VALUES (1, 1)






