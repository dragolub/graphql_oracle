-- Create table
create table TRAILER
(
  trailer_id      NUMBER(10) not null,
  trailer_license VARCHAR2(255 CHAR) not null,
  org_id          NUMBER(5)
)

--- Insert Data
INSERT INTO TRAILER VALUES ( 1, 'Trailer1' , 1);
INSERT INTO TRAILER VALUES ( 2, 'Trailer2' , 1);
INSERT INTO TRAILER VALUES ( 3, 'Trailer3' , 1);
INSERT INTO TRAILER VALUES ( 4, 'Trailer4' , 1);


--- Create a PL/SQL procedure

CREATE OR REPLACE PROCEDURE select_trailer_org 
				                     (p_trailer_id IN NUMBER, 
	                                                  p_org_id IN NUMBER,
				                            result OUT SYS_REFCURSOR)
AS
BEGIN

open result for
select t.trailer_id, t.is_active
  from trailer t
 where t.org_id = p_org_id and 
    t.trailer_id = p_trailer_id;

END;



-- Create table
create table trucks
(
  TRUCK_ID        NUMBER(10) not null,
  TRUCK_LICENSE   VARCHAR2(255 CHAR) not null,
  ORG_ID          NUMBER(5),
  IS_ACTIVE	  NUMBER(1),	
  IS_AUTONOMOUS   NUMBER(1)
)

--- Insert Data
INSERT INTO trucks VALUES ( 1, 'Truck1' , 1, 1, 1);
INSERT INTO trucks VALUES ( 2, 'Truck2' , 1, 0, 1);
INSERT INTO trucks VALUES ( 3, 'Truck3' , 1, 1, 0);
INSERT INTO trucks VALUES ( 4, 'Truck4' , 1, 0, 0);



