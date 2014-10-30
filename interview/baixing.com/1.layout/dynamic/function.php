<?php 
    function getCategoriesByPid($categories, $pid = 0){
        $res = array();
        foreach($categories as $c){
            if($pid == $c['pid']){
                array_push($res, $c);
            }
        }
        return $res;
    }
    
    function getColumnData($categories, $defineColumn = 3){
        $topCategories = getCategoriesByPid($categories);
        $data = array();
        if(count($topCategories)>=$defineColumn){
            for($i=1;$defineColumn>=$i;$i++){
                $data[$i] = array();
            }
            $c = 1;
            $x = 0;
            foreach($topCategories as $v){
                 $r = $c - ($defineColumn * $x );
                 if($c/$defineColumn >= $x+1){
                     $x++;
                 }
                 $c++;
                 array_push($data[$r],$v);
            }
        }
		else{
			die('Not enough top categories.');
		}
        return $data;
    }