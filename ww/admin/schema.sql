create table users (
	username varchar(20) primary key not null,
	password varchar(40) not null
);

create table scores(
	username varchar(20) not null,
	currscore integer,
	highscore integer,

	constraint uname_const 
		foreign key (username) references users
);