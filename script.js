var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : '104.154.250.168', // localhost
  user     : 'sofi',
  password : 'SOFI2020#Sanofi',
  database : 'sofi_test'
});

connection.connect();

let create_table = [
`CREATE TABLE notifications (
 id int(11) NOT NULL AUTO_INCREMENT,
 user_id int(11) DEFAULT NULL,
 person_name varchar(45) DEFAULT NULL,
 notification_id int(11) DEFAULT NULL,
 notification_with enum('clinical_case','post','post_kol') DEFAULT NULL,
 viewed tinyint(1) DEFAULT '0',
 interaction_to varchar(15) DEFAULT NULL,
 interaction varchar(15) DEFAULT NULL,
 created_at datetime DEFAULT NULL,
 updated_at datetime DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX fk_notifications_user_idx (user_id ASC),
  CONSTRAINT fk_notifications_user
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);`,

`CREATE TABLE post_types (
  type varchar(8) NOT NULL,
  description varchar(100) DEFAULT NULL,
  PRIMARY KEY (type));`,

`CREATE TABLE banners (
  id int(11) NOT NULL AUTO_INCREMENT,
  title varchar(255) DEFAULT NULL,
  content text,
  url varchar(5000) DEFAULT NULL,
  user_id int(11) DEFAULT NULL,
  created_at datetime NOT NULL,
  updated_at datetime DEFAULT NULL,
  active tinyint(1) NOT NULL,
  PRIMARY KEY (id),
  KEY fk_user_id_idx (user_id),
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE NO ACTION ON UPDATE NO ACTION);`,

`CREATE TABLE favorites (
  id int(11) NOT NULL AUTO_INCREMENT,
  favorite varchar(45) DEFAULT NULL,
  favorite_id int(11) NOT NULL,
  user_id int(11) NOT NULL,
  created_at datetime DEFAULT NULL,
  updated_at datetime DEFAULT NULL,
  PRIMARY KEY (id),
  KEY fk_favorites_user_idx (user_id),
  CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE NO ACTION ON UPDATE NO ACTION);`,

`CREATE TABLE posts_kols (
  id int(11) NOT NULL AUTO_INCREMENT,
  content text,
  user_id int(11) DEFAULT NULL,
  url varchar(5000) DEFAULT NULL,
  parent_id int(11) DEFAULT NULL,
  original_id int(11) DEFAULT NULL,
  post_type varchar(8) DEFAULT NULL,
  addressed_to enum('GENERAL','SPECIALITY') DEFAULT 'GENERAL',
  created_at datetime DEFAULT NULL,
  updated_at datetime DEFAULT NULL,
  PRIMARY KEY (id),
  KEY fk_user_kol_id_idx (user_id),
  KEY fk_posts_kols_original_idx (original_id),
  CONSTRAINT fk_posts_kols_original FOREIGN KEY (original_id) REFERENCES posts_kols (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT fk_user_kol_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE NO ACTION ON UPDATE NO ACTION)`,

`CREATE TABLE posts_specialities (
  posts_kol_id int(11) NOT NULL,
  speciality_id int(11) NOT NULL,
  created_at datetime DEFAULT NULL,
  updated_at datetime DEFAULT NULL,
  PRIMARY KEY (posts_kol_id,speciality_id),
  KEY fk_posts_id_idx (posts_kol_id),
  KEY fk_speciality_id_idx (speciality_id),
  CONSTRAINT fk_posts_id FOREIGN KEY (posts_kol_id) REFERENCES posts (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_speciality_id FOREIGN KEY (speciality_id) REFERENCES specialities (id) ON DELETE CASCADE ON UPDATE CASCADE);`
];

for(let i=0; i<create_table.length; i++){
  connection.query(create_table[i], function (error, results, fields) {
    if (error) throw error;
    console.log('Table '+(i+1)+' created: ', results);
  });
}

let query_alter = [`ALTER TABLE posts
ADD COLUMN post_type VARCHAR(8) NOT NULL AFTER url;`,

`ALTER TABLE specialities
ADD COLUMN specialityId VARCHAR(15) NOT NULL AFTER name;`]

for(let i=0; i<query_alter.length; i++){
  connection.query(query_alter[i], function (error, results, fields) {
    if (error)
      console.log('Alter table '+[i]+' ADD COLUMN failed', error)
    console.log('Alter table '+[i]+' ADD COLUMN created: ', results);
  });
}


connection.query(`UPDATE paths SET
  path = '/api/v1/shares/:type(clinical-case|post|post_kol)/:id(\\\\d+)/:social_network(facebook|twitter|linkedin|whatsapp|sofi)'
  WHERE id = '23';`,
  function (error, results, fields) {
  if (error)
    console.log('Update path with id equal to 23 failed', error)
  console.log('Update path with id equal to 23 created: ', results);
});

connection.query(`UPDATE paths SET
  path = '/api/v1/specialities/'
  WHERE id = '20';`,
  function (error, results, fields) {
  if (error)
    console.log('Update path with id equal to 20 failed', error)
  console.log('Update path with id equal to 20 created: ', results);
});

let date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

let inserts = [
  `INSERT INTO post_types (type, description)
  VALUES ('imagen', 'Publicacion que tiene imagen de referencia'),
  ('texto', 'Publicacion que tiene texto html solamente'),
  ('video', 'Publicacion que tiene video de referencia');`,

  `INSERT INTO paths (path, verb, created_at, updated_at)
  VALUES ('/api/v1/posts_kol/', 'POST', '`+ date +`', '`+ date +`'),
  ('/api/v1/banner/', 'POST', '`+ date +`', '`+ date +`'),
  ('/api/v1/banner/', 'GET', '`+ date +`', '`+ date +`'),
  ('/api/v1/banner/:id(\\\\d+)/:type(enable|disable)', 'POST', '`+ date +`', '`+ date +`'),
  ('/api/v1/banner/withImages', 'GET', '`+ date +`', '`+ date +`');`,

  `INSERT INTO security_rules (path_id, role_id, created_at, updated_at) VALUES
    ('3', '2', '`+ date +`', '`+ date +`'),
    ('6', '2', '`+ date +`', '`+ date +`'),
    ('8', '2', '`+ date +`', '`+ date +`'),
    ('9', '2', '`+ date +`', '`+ date +`'),
    ('10', '2', '`+ date +`', '`+ date +`'),
    ('11', '2', '`+ date +`', '`+ date +`'),
    ('12', '2', '`+ date +`', '`+ date +`'),
    ('15', '2', '`+ date +`', '`+ date +`'),
    ('16', '2', '`+ date +`', '`+ date +`'),
    ('38', '2', '`+ date +`', '`+ date +`'),
    ('39', '3', '`+ date +`', '`+ date +`'),
    ('40', '1', '`+ date +`', '`+ date +`'),
    ('41', '3', '`+ date +`', '`+ date +`'),
    ('42', '1', '`+ date +`', '`+ date +`');`
]

for(let i=0; i<inserts.length; i++){
  connection.query(inserts[i], function (error, results, fields) {
    if (error) throw error;
    console.log('Insert '+(i+1)+' created: ', results);
  });
}

connection.end();