-- @Marcus

-- ------------------------------------
-- Used queries in code-snippet project
-- ------------------------------------

-- Select all users data (except password)
-- /users
SELECT 
	user_id, 
	username, 
    created_at 
FROM `user`;

-- Create new user
-- /users/new
SELECT username FROM `user` WHERE username = ?; -- ? in API

INSERT INTO `user` (username, `password`) VALUES (?, ?); -- ? in API

-- Select all code snippets
-- /code-snippets
SELECT 
	CS.title,
	U.username AS author,
    U.user_id AS author_id,
    PL.language_name AS programming_language,
    CS.code_snippet AS `code`,
    CS.created_at AS `date`
FROM 
	code_snippet AS CS
INNER JOIN `user` AS U
	ON CS.user_id = U.user_id
INNER JOIN programming_language AS PL
	ON CS.language_id = PL.language_id;
    
-- New code-snippet
-- /code-snippets/new
INSERT INTO code_snippet (user_id, title, code_snippet, language_id) VALUES (?, ?, ?, ?); -- ? in API

-- New fave code-snippet
-- /code-snippet-faves/new
INSERT INTO code_snippet_fave (user_id, snippet_id) VALUES (?, ?); -- ? in API

-- Remove fave code-snippet
DELETE FROM code_snippet_fave WHERE snippet_id = ?; -- ? in API

-- Select fave code-snippets for specific user id
SELECT 
	CS.title, 
	U.username AS author,
    U.user_id AS author_id,
    PL.language_name AS programming_language,
    CS.code_snippet AS `code`,
    CS.snippet_id 
FROM code_snippet_fave AS CSF 
INNER JOIN code_snippet AS CS 
	ON CSF.snippet_id = CS.snippet_id 
INNER JOIN programming_language AS PL 
    ON CS.language_id = PL.language_id 
INNER JOIN `user` AS U 
	ON CS.user_id = U.user_id 
		WHERE CSF.user_id = ?; -- ? in API

-- Select all from programming_language
SELECT * FROM programming_language;