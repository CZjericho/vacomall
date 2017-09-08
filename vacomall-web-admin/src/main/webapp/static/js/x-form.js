layui.use(['layer','form','table','upload'], function(){
	var $ = layui.jquery,
		upload = layui.upload,
  		form = layui.form;
		
		//扩展方法
		$.fn.serializeJson=function(){    
	        var serializeObj={};    
	        var array=this.serializeArray();    
	        var str=this.serialize();    
	        $(array).each(function(){    
	            if(serializeObj[this.name]){    
	                if($.isArray(serializeObj[this.name])){    
	                    serializeObj[this.name].push(this.value);    
	                }else{    
	                    serializeObj[this.name]=[serializeObj[this.name],this.value];    
	                }    
	            }else{    
	                serializeObj[this.name]=this.value;     
	            }    
	        });    
	        return serializeObj;    
	    };    
		
		//验证
		form.verify({
			  username: function(value, item){ //value：表单的值、item：表单的DOM对象
			    if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
			      return '用户名不能有特殊字符';
			    }
			    if(/(^\_)|(\__)|(\_+$)/.test(value)){
			      return '用户名首尾不能出现下划线\'_\'';
			    }
			    if(/^\d+\d+\d$/.test(value)){
			      return '用户名不能全为数字';
			    }
			  }
			  //我们既支持上述函数式的方式，也支持下述数组的形式
			  //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
			  ,pass: [
			    /^[\S]{6,12}$/
			    ,'密码必须6到12位，且不能出现空格'
			  ] ,
			  
			  file : function(value,item){
				  if(value==''){
					  return "上传文件不能为空";
				  }
			  }
		 }); 
		
		//文件上传
		
		upload.render({
		    elem: '#file-btn'
		    ,url: '/file/upload/'
		    ,size: 5*1024 //限制文件大小，单位 KB
		    ,done: function(res){
		    	if(res.status=='success'){
		    		layer.msg("文件上传成功", {icon:1});
		    		var urls = res.urls;
		    		 $("#file-txt").html(urls[0]);
		    		 $("#file-val").val(urls[0]);
		    	}else{
		    		layer.msg(res.msg, {icon:2});
		    	}
		    }
		  });
		
	  	//监听提交
		form.on('submit(submit)', function(data){
		  var values = data.field,
	   		fm = data.form;
		// console.log( $(fm).serializeJson());
		//  console.log(values);
	  	   var index = layer.load(1); //换了种风格
	          $.post($(fm).attr('action'),values,function(data){
	          	layer.close(index); 
	          	if(data.code==200){
	          		parent.layer.msg('提交成功', {icon: 1});
	          		//刷新父table
	          		parent.layui.table.reload('table'); 
	                  // 获得frame索引
	                  var index2 = parent.layer.getFrameIndex(window.name);
	                  //关闭当前frame
	                  parent.layer.close(index2);
	          	}else{
	          		layer.msg(data.msg, {icon:2});
	          	}
	              
	          });
	      	return false;
	      });
	});

