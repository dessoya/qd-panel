
CREATE TABLE `symbol_templates` (

  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,

  `name` varchar(255),

  PRIMARY KEY (`id`)
) ENGINE=MyISAM;

CREATE TABLE `symbol_template_composition` (

  `symbol_template_id` int(10) unsigned NOT NULL,
  `symbol` varchar(255) NOT NULL,

  `echo_symbol` varchar(255),
  `bid_markup` double,
  `ask_markup` double,
  `min_spread` double,
  `max_spread` double,
  `depth` double,
  `priority` double,
  `timeout` double,


  PRIMARY KEY (`symbol_template_id`, `symbol`)
) ENGINE=MyISAM;
