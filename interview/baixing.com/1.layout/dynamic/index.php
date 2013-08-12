<?php
    require('function.php');
    $categories = array(
        array(
            'id'=> 1,
            'pid'=> 0,
            'name'=>'物品交易',
            'recommend'=>false,
            'color'=>'eb974e',
            'count'=> 57
        ),
        array(
            'id'=> 2,
            'pid'=> 0,
            'name'=>'车辆买卖',
            'recommend'=>false,
            'color'=>'f1c40d',
            'count'=> 33
        ),
        array(
            'id'=> 3,
            'pid'=> 0,
            'name'=>'房屋租售',
            'recommend'=>false,
            'color'=>'58d78d',
            'count'=> 321
        ),
        array(
            'id'=> 4,
            'pid'=> 1,
            'name'=>'第一分类',
            'recommend'=>false
        ),
        array(
            'id'=> 5,
            'pid'=> 1,
            'name'=>'第二分类',
            'recommend'=>false
        ),
        array(
            'id'=> 6,
            'pid'=> 4,
            'name'=>'奢侈大牌',
            'recommend'=>false
        ),
        array(
            'id'=> 7,
            'pid'=> 4,
            'name'=>'全新转让/礼品',
            'recommend'=>false
        ),
        array(
            'id'=> 8,
            'pid'=> 4,
            'name'=>'婚庆闲置',
            'recommend'=>true
        ),
        array(
            'id'=> 9,
            'pid'=> 5,
            'name'=>'二手手机',
            'recommend'=>false
        ),
        array(
            'id'=> 10,
            'pid'=> 5,
            'name'=>'手机号码',
            'recommend'=>false
        ),
        array(
            'id'=> 11,
            'pid'=> 5,
            'name'=>'台式电脑',
            'recommend'=>false
        ),
        array(
            'id'=> 12,
            'pid'=> 5,
            'name'=>'电脑配件电脑配件电脑配件电脑配件电脑配件电脑配件电脑配件/宽带',
            'recommend'=>false
        ),
        array(
            'id'=> 13,
            'pid'=> 5,
            'name'=>'笔记本',
            'recommend'=>false
        ),
        array(
            'id'=> 14,
            'pid'=> 5,
            'name'=>'平板电脑',
            'recommend'=>false
        ),
        array(
            'id'=> 15,
            'pid'=> 5,
            'name'=>'摄影摄像',
            'recommend'=>false
        ),
        array(
            'id'=> 16,
            'pid'=> 5,
            'name'=>'MP3/游戏机',
            'recommend'=>false
        ),
        array(
            'id'=> 17,
            'pid'=> 5,
            'name'=>'二手家具',
            'recommend'=>false
        ),
        array(
            'id'=> 18,
            'pid'=> 5,
            'name'=>'家用电器',
            'recommend'=>false
        ),
        array(
            'id'=> 19,
            'pid'=> 2,
            'name'=>'第三分类',
            'recommend'=>false
        ),
        array(
            'id'=> 20,
            'pid'=> 2,
            'name'=>'第四分类',
            'recommend'=>false
        ),
        array(
            'id'=> 21,
            'pid'=> 19,
            'name'=>'二手轿车',
            'recommend'=>false
        ),
        array(
            'id'=> 22,
            'pid'=> 19,
            'name'=>'全国',
            'recommend'=>false
        ),
        array(
            'id'=> 23,
            'pid'=> 19,
            'name'=>'货车/工程车',
            'recommend'=>true
        ),
        array(
            'id'=> 24,
            'pid'=> 19,
            'name'=>'本地下限车',
            'recommend'=>false
        ),
        array(
            'id'=> 25,
            'pid'=> 19,
            'name'=>'全国下线车',
            'recommend'=>false
        ),
        array(
            'id'=> 26,
            'pid'=> 19,
            'name'=>'新车优惠/4S店',
            'recommend'=>false
        ),
        array(
            'id'=> 27,
            'pid'=> 19,
            'name'=>'面包车/客车',
            'recommend'=>false
        ),
        array(
            'id'=> 28,
            'pid'=> 19,
            'name'=>'拖拉机/收割机',
            'recommend'=>false
        ),
        array(
            'id'=> 29,
            'pid'=> 20,
            'name'=>'汽车用品',
            'recommend'=>false
        ),
        array(
            'id'=> 30,
            'pid'=> 20,
            'name'=>'车辆收购',
            'recommend'=>false
        ),
        array(
            'id'=> 31,
            'pid'=> 3,
            'name'=>'第五分类',
            'recommend'=>false
        ),
        array(
            'id'=> 32,
            'pid'=> 3,
            'name'=>'第六分类',
            'recommend'=>false
        ),
        array(
            'id'=> 33,
            'pid'=> 31,
            'name'=>'租房',
            'recommend'=>false
        ),
        array(
            'id'=> 34,
            'pid'=> 31,
            'name'=>'学生求职公寓',
            'recommend'=>false
        ),
        array(
            'id'=> 35,
            'pid'=> 31,
            'name'=>'日租/短租',
            'recommend'=>false
        ),
        array(
            'id'=> 36,
            'pid'=> 33,
            'name'=>'整套出租',
            'recommend'=>false
        ),
        array(
            'id'=> 37,
            'pid'=> 33,
            'name'=>'合租',
            'recommend'=>false
        ),
        array(
            'id'=> 38,
            'pid'=> 32,
            'name'=>'二手房出租',
            'recommend'=>false
        ),
        array(
            'id'=> 39,
            'pid'=> 32,
            'name'=>'新房出租',
            'recommend'=>false
        ),
        array(
            'id'=> 40,
            'pid'=> 32,
            'name'=>'写字楼出售',
            'recommend'=>false
        ),
        array(
            'id'=> 41,
            'pid'=> 32,
            'name'=>'商铺出租',
            'recommend'=>false
        ),
        
        array(
            'id'=> 42,
            'pid'=> 0,
            'name'=>'全职招聘',
            'recommend'=>false,
            'color'=>'3598dc',
            'count'=> 589
        ),
        array(
            'id'=> 43,
            'pid'=> 0,
            'name'=>'生活服务',
            'recommend'=>false,
            'color'=>'ae7ac4',
            'count'=> 1112
        ),
        array(
            'id'=> 44,
            'pid'=> 42,
            'name'=>'全职招聘1',
            'recommend'=>false,
            'color'=>'ae7ac4',
            'count'=> 1112
        ),
        array(
            'id'=> 45,
            'pid'=> 42,
            'name'=>'全职招聘2',
            'recommend'=>false
        ),
        array(
            'id'=> 46,
            'pid'=> 44,
            'name'=>'销售/市场/业务员',
            'recommend'=>false
        ),
        array(
            'id'=> 47,
            'pid'=> 44,
            'name'=>'工人/技工',
            'recommend'=>false
        ),
        array(
            'id'=> 48,
            'pid'=> 44,
            'name'=>'文员/客服/助理 ',
            'recommend'=>false
        ),
        array(
            'id'=> 49,
            'pid'=> 45,
            'name'=>'司机/驾驶员',
            'recommend'=>false
        ),
        array(
            'id'=> 47,
            'pid'=> 45,
            'name'=>'营业员/促销/零售',
            'recommend'=>false
        ),
        array(
            'id'=> 50,
            'pid'=> 45,
            'name'=>'服务员/收银员',
            'recommend'=>true
        ),
        array(
            'id'=> 51,
            'pid'=> 45,
            'name'=>'厨师/切配',
            'recommend'=>false
        ),
        array(
            'id'=> 52,
            'pid'=> 45,
            'name'=>'保安/保洁',
            'recommend'=>false
        ),
        array(
            'id'=> 53,
            'pid'=> 45,
            'name'=>'送货/快递/仓管',
            'recommend'=>false
        ),
        array(
            'id'=> 54,
            'pid'=> 43,
            'name'=>'生活服务1',
            'recommend'=>false
        ),
        array(
            'id'=> 55,
            'pid'=> 43,
            'name'=>'生活服务2',
            'recommend'=>false
        ),
        array(
            'id'=> 56,
            'pid'=> 54,
            'name'=>'汽修/保养',
            'recommend'=>false
        ),
        array(
            'id'=> 57,
            'pid'=> 54,
            'name'=>'陪驾/代驾',
            'recommend'=>false
        ),
        array(
            'id'=> 58,
            'pid'=> 54,
            'name'=>'摄影',
            'recommend'=>false
        ),
        array(
            'id'=> 59,
            'pid'=> 55,
            'name'=>'保洁/清洗',
            'recommend'=>false
        ),
        array(
            'id'=> 60,
            'pid'=> 55,
            'name'=>'物品回收',
            'recommend'=>false
        ),
        array(
            'id'=> 61,
            'pid'=> 55,
            'name'=>'开锁/修锁',
            'recommend'=>false
        )
    );
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="target-densitydpi=device-dpi, width=device-width, initial-scale=1.0, maximum-scale=1">
        <title>列表组件</title>
        <link rel="stylesheet" href="../css/base.css" type="text/css">
        <link rel="stylesheet" href="../css/screen.css" type="text/css">
        <!--[if lte IE 7]>
            <link rel="stylesheet" href="../css/ie6.css" type="text/css">
        <![endif]-->
        
        <!-- 响应式样式 -->
        <link rel="stylesheet" href="../css/responsive.css" type="text/css">
		
		<?php $column = ! empty($_GET['column']) ? $_GET['column'] : 5;?>
		<style>
			.wrapper{
				width: auto;
			}
			.ui-container-column{
				width: <?php echo 100/$column-2;?>%;
				margin-right: 2%;
			}
			.nav{
				padding-top: 15px;
				padding-bottom: 15px;
				text-align: center;
				font-size: 16px;
			}
			.nav a{
				color: red;
				font-weight: bold;
			}
		</style>
    </head>
    <body>
        <div class="wrapper">
			<div class="nav">
				<a href="?column=1">显示一列</a>&nbsp;&nbsp;
				<a href="?column=2">显示两列</a>&nbsp;&nbsp;
				<a href="?column=3">显示三列</a>&nbsp;&nbsp;
				<a href="?column=4">显示四列</a>&nbsp;&nbsp;
				<a href="?column=5">显示五列</a>				
			</div>
            <div class="ui-container">
                <?php foreach(getColumnData($categories, $column) as $tCs):?>
                <div class="ui-container-column">
                    <?php foreach($tCs as $tCategory):?>
                    <div class="ui-box">
                        <h3 class="ui-box-title" style="border-color: #<?php echo $tCategory['color'];?>">
                            <a href="" target="_blank" title="<?php echo $tCategory['name'];?>">
                                <?php echo $tCategory['name'];?>
                            </a>
                            <small><?php echo $tCategory['count'];?></small>
                        </h3>
                        <div class="ui-box-list">
                            <?php 
                            $count = 1;
                            $ac = getCategoriesByPid($categories, $tCategory['id']);
                            $length = count($ac);
                            foreach($ac as $c):
                            ?>
                                <?php 
                                $bc = getCategoriesByPid($categories, $c['id']);
                                if( ! empty($bc)):
                                foreach($bc as $cc):
                                ?>
                                    <a href="" target="_blank" title="<?php echo $cc['name'];?>"<?php if($cc['recommend']):?> class="color-red"<?php endif;?>>
                                        <?php echo $cc['name'];?>
                                    </a>
                                    <?php 
                                    $sc = getCategoriesByPid($categories, $cc['id']);
                                    if( ! empty($sc)):
                                    ?> 
                                    <div class="small">
                                        <?php  foreach($sc as $ccc): ?>   
                                            <a href="" target="_blank" title="<?php echo $ccc['name'];?>"<?php if($cc['recommend']):?> class="color-red"<?php endif;?>>
                                                <?php echo $ccc['name'];?>
                                            </a>
                                        <?php endforeach;?>
                                    </div>
                                    <?php endif;?>
                                <?php endforeach;?>
                                    <?php if($count!=$length):?>
                                        <hr>
                                    <?php $count++;endif;?>
                                <?php endif;?>
                            <?php endforeach;?>
                        </div>
                    </div>
                    <?php endforeach;?>
                </div>
                <?php endforeach;?>
            </div>
        </div>
    </body>
</html>
