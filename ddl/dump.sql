/*
MySQL Data Transfer
Source Host: 46.166.195.117
Source Database: qd-panel
Target Host: 46.166.195.117
Target Database: qd-panel
Date: 27.10.2014 17:42:21
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for change_events
-- ----------------------------
CREATE TABLE `change_events` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `event` varchar(255) NOT NULL,
  `object_type_id` int(10) unsigned NOT NULL,
  `object_id` int(10) unsigned NOT NULL,
  `state` enum('done','in_work','error','new') NOT NULL DEFAULT 'new',
  `create_dt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `in_progress_dt` timestamp NULL DEFAULT NULL,
  `done_dt` timestamp NULL DEFAULT NULL,
  `event_data` text,
  `execution_report` text,
  PRIMARY KEY (`id`),
  KEY `object` (`object_type_id`,`object_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for config
-- ----------------------------
CREATE TABLE `config` (
  `name` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for object_types
-- ----------------------------
CREATE TABLE `object_types` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for operation_events
-- ----------------------------
CREATE TABLE `operation_events` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for rules
-- ----------------------------
CREATE TABLE `rules` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `source_id` int(10) unsigned NOT NULL,
  `login` int(10) unsigned DEFAULT NULL,
  `group` varchar(255) DEFAULT NULL,
  `operation_event_id` tinyint(3) unsigned NOT NULL,
  `symbol_template_id` int(10) unsigned NOT NULL,
  `target_id` int(10) unsigned DEFAULT NULL,
  `feedor_id` int(10) unsigned DEFAULT NULL,
  `rule_type` enum('classic','bb') NOT NULL,
  `link_information` varchar(255) DEFAULT NULL,
  `lock_id` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `template` (`symbol_template_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for servers
-- ----------------------------
CREATE TABLE `servers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for symbol_template_composition
-- ----------------------------
CREATE TABLE `symbol_template_composition` (
  `symbol_template_id` int(10) unsigned NOT NULL,
  `symbol` varchar(255) NOT NULL,
  `echo_symbol` varchar(255) DEFAULT NULL,
  `bid_markup` double DEFAULT NULL,
  `ask_markup` double DEFAULT NULL,
  `min_spread` double DEFAULT NULL,
  `max_spread` double DEFAULT NULL,
  `depth` double DEFAULT NULL,
  `priority` double DEFAULT NULL,
  `timeout` double DEFAULT NULL,
  `price_left` double DEFAULT NULL,
  `price_right` double DEFAULT NULL,
  `factor` double DEFAULT NULL,
  PRIMARY KEY (`symbol_template_id`,`symbol`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for symbol_templates
-- ----------------------------
CREATE TABLE `symbol_templates` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `lock_id` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=35 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Function structure for wait_for_event
-- ----------------------------
DELIMITER ;;
CREATE DEFINER=`zh`@`%` FUNCTION `wait_for_event`(event_id int) RETURNS varchar(1024) CHARSET utf8
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

END;;
DELIMITER ;

