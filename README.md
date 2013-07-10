alvinhui.github.io
==================
function getCate($prvid=0,$level=0,$noid = 0,$isall=1){
  	/*	
		$prvid=0;	父类的id 根据此ID查取此父类下的所有家族成员
		$level=0;	父类的起始级别。用一个变量来存储每一个家族类的级别，更直观
		$noid=0;	不查询的ID。此变量用于中断某一级别的查询
		$isall=1;	是否查取所有家族成员。此变量可以用来设置只查同父类的直属子类，不查子类的子类
	*/	
		static $res;//声明静态变量
		$data=$GLOBALS['mysql']->getAll('*','taoe_category',"prvid='$prvid' && cid!='$noid'",'cid asc');//查询到所有指定父类的记录	得到一个二维数组（得到孩子[直属子类]）
		if($isall){
			foreach($data as $v){	//拿一个二维数组去循环，得到一个一维数组（一条记录）
				$v['level']=$level;//加入一个新成员到记录中，用来存储每个家族类的级别
	
				$res[]=$v;//把得到的记录存储到数组
				$this->getCate($v['cid'],$level+1,$noid,$isall=1);//向下查找（得到孙子[子类的子类]）
			}
			return (array)$res;//返回所有指定祖宗的家族成员
		}
		else{
			return (array)$data;//返回所有指定父亲的子成员
		}
	}
