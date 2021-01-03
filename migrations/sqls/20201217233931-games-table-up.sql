CREATE TABLE IF NOT EXISTS games (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	status SMALLINT,
	red_remaining SMALLINT,
	blue_remaining SMALLINT,
	current_turn SMALLINT
);