-- Function "wait_for_event" DDL

-- CREATE DEFINER=`zh`@`%` FUNCTION `wait_for_event`(event_id int) RETURNS varchar(1024) CHARSET utf8
CREATE FUNCTION `wait_for_event`(event_id int) RETURNS varchar(1024) CHARSET utf8
BEGIN



DECLARE s float(5,3) DEFAULT 0.001;

DECLARE i int DEFAULT 0;

DECLARE t float(5,3);

DECLARE sr int;

DECLARE r VARCHAR(1024) default '-1';



DECLARE s1_s VARCHAR(32);

DECLARE s1_e text;





WHILE s < 1 DO



if i < 6 then

 set t = 0.01;

else

 set t = 0.05;

end if;



select sleep(t) into sr;



set s = s + t;



select state,execution_report into s1_s, s1_e from change_events where id = event_id;

if s1_s = 'done' then

 set s = 2;

 set r = s1_e;

end if;



END WHILE;



RETURN r;



END;
