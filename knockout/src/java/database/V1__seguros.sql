CREATE TABLE IF NOT EXISTS `seguro` (
  `idSeguro` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `ape1` varchar(255) DEFAULT NULL,
  `ape2` varchar(255) DEFAULT NULL,
  `edad` int(11) DEFAULT NULL,
  `sexo` varchar(50) DEFAULT NULL,
  `casado` tinyint(1) DEFAULT NULL,
  `numHijos` int(11) DEFAULT NULL,
  `embarazada` tinyint(1) DEFAULT NULL,
  `oftalmologia` tinyint(1) DEFAULT NULL,
  `dental` tinyint(1) DEFAULT NULL,
  `fecundacionInVitro` tinyint(1) DEFAULT NULL,
  `corazon` tinyint(1) DEFAULT NULL,
  `estomacal` tinyint(1) DEFAULT NULL,
  `rinyones` tinyint(1) DEFAULT NULL,
  `alergia` tinyint(1) DEFAULT NULL,
  `nombreAlergia` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idSeguro`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `usuario` (
  `idUsuario` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `ape1` varchar(255) DEFAULT NULL,
  `ape2` varchar(255) DEFAULT NULL,
  `admin` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`idUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

INSERT INTO `usuario` (`idUsuario`, `login`, `password`, `nombre`, `ape1`, `ape2`, `admin`) VALUES
	(1, 'alumno', 'alumno', 'Juan', 'García', 'Perez', 1);

