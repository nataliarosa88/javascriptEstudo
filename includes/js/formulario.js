

function alteraTexto(){	
	$("input[name=inscricao_municipal]").val("");
	if (document.getElementById('natureza1').checked == true) {
	  $("#textoData").html("Data de registro do ato constitutivo da empresa no órgão competente");
	  $("input[name=inscricao_municipal]").prop("disabled", true);	 
      desabilitaCheckDataFim('1');	  
	}else if (document.getElementById('natureza2').checked  == true) {
	  $("#textoData").html("Data de registro da alteração do ato constitutivo da empresa no órgão competente");
	  $("input[name=inscricao_municipal]").prop("disabled", false);
      desabilitaCheckDataFim('2');	  
	}else if (document.getElementById('natureza3').checked  == true) {
	  $("#textoData").html("Data de registro do distrato social da empresa ou de documento equivalente, no órgão competente");	
	  $("input[name=inscricao_municipal]").prop("disabled", false);
	  desabilitaCheckDataFim('3');
	}else{
	  document.getElementById('textoData').html = 'Data de registro do ato constitutivo da empresa no órgão competente';	
	} 
	$("#alteracao_data_topo").focus();
}

function desabilitaCheckDataFim(opcao){
	$("input[type=checkbox][id='encerramento']").each(function(){
		$(this).prop("checked", false);		
		if(opcao == '1'){
		  $(this).prop("disabled", true);
		}else{
		  $(this).prop("disabled", false);			
		}  
	});	
	return true;
}

function bloqueiaNatureza(flag){
	document.getElementById('natureza1').disabled = flag;
	document.getElementById('natureza2').disabled = flag;
	document.getElementById('natureza3').disabled = flag;	
}

function onBlur_data_topo(){
	if($("#alteracao_data_topo").val() != ''){
		//alert('inicio');
	  if ($("#alteracao_data_topo").val().length == 10){
		//alert($("#alteracao_data_topo").val());  
		if (validaData($("#alteracao_data_topo").val())){		
			if ((document.getElementById('natureza2').checked  == true) || (document.getElementById('natureza3').checked  == true)){
			  $("input[name=alteracao_data]").val($("#alteracao_data_topo").val()); 
			  //$("#alteracao_data_topo").prop("disabled", true);	
			  bloqueiaNatureza(true);
              //desabilitaCheckDataFim('2');
			  buscaCNAEsEmpresa('cnae');			  
			}else if (document.getElementById('natureza1').checked == true){
			  $("#alteracao_data").val("");	
			  //$("#alteracao_data_topo").prop("disabled", true);	
			  bloqueiaNatureza(true);
			  //desabilitaCheckDataFim('1');
			  buscaCNAEsEmpresa('cnae');
			}else{
			  $("#alteracao_data_topo").val("");
			  $("#alteracao_data_topo").focus();
			  alert("Selecione a Natureza do Pedido de Inscrição");
			}
		}else{	
		  $("#alteracao_data_topo").val("");
		  $("#alteracao_data_topo").focus();
		  alert('Data inválida. Favor corrigir.');
		}  
	  }
	  else{
		  $("#alteracao_data_topo").val("");
		  $("#alteracao_data_topo").focus();
		  alert('Data incompleta. Favor corrigir.');		  
	  }	  	
	}
}

function reset_campos(flag){
	bloqueiaNatureza(flag);
    $("#alteracao_data_topo").prop("disabled", flag);
	$("input[name=inscricao_municipal]").prop("disabled", flag);
	$("#textoData").html("Data de registro do ato constitutivo da empresa no órgão competente");
}

function validaData(data) {
var dia = data.substring(0, 2);
var mes = data.substring(3, 5);
var ano = data.substring(6, 10);

var pad = "00";

var dia_atual= ""+01;
var dia_atual = pad.substring(0, pad.length - dia_atual.length) + dia_atual;

var mes_atual= ""+09;
var mes_atual = pad.substring(0, pad.length - mes_atual.length) + mes_atual;

var ano_atual= ""+2018;

var dt_atual = ano_atual.toString() + mes_atual.toString() + dia_atual.toString();
var dt_informada = ano+mes+dia; 
var teste = new Date('2011-04-11');
if(!(dt_informada <= dt_atual)){
  return false;
}



 //Verifica se o ano está correto
 if (ano.length == 4 && ano > 1900 && ano < 2100) {
     // Verificando o intervalo permitido para os valores dos meses e dias
  if (dia > 0 && dia <=31 && mes > 0 && mes <= 12) {  
   // Verifica os meses que posuem dia 30 dias  
   if ((mes == 4 || mes == 6 || mes == 9 || mes == 11) && dia > 30) {   
     return false;   
   }    
   // caso seja mês 2 verifica se o ano é bissexto
   if (mes == 2) { 
    //se for bissexto
    if (ano%4 == 0 && (ano%100 != 0 || ano%400==0)) {
       // Se for bissexto pode o dia ser no máximo 29   
       if (dia > 29) 
      return false; 
    // se não for bisexto o dia pode ser no máximo 28                  
    } else if (dia > 28) {    
     return false;    
    }
   } 
  } else {    
   return false;
  }
  // Data válida
  return true; 
 } 
 else {
  return false;
 } 
}

function verificaCampoCnpj(campoCnpj){
  if ($("#alteracao_data_topo").val().length == 10){//verifica se está preenchido
    if ((document.getElementById('natureza1').checked == true) || ($("input[name=inscricao_municipal]").val() != '')){//obriga a preencher a inscricao municipal para DIC de alteracao
	  if(!verificaCnpj(campoCnpj)){
		  //alert("chamar função ajax");
		  if(!$("input[name=cnpj]").attr('readOnly')){
		    buscaDadosEmpresa();
		  }else{
			  //alert("teste ok");
		  }
	  }	
	  else{
		  return true;// cnpj invalido
	  }
	}else{
	  alert("Preencha o campo Inscrição Municipal") ;
	  campoCnpj.value = "";
	  return true;		
	}
  }else{
	alert("Preencha o campo Data de Registro") ;
	campoCnpj.value = "";
	return true;
  }  
}

function buscaDadosEmpresa(){	

var inscricao =  $("input[name=inscricao_municipal]").val();
var cnpj =  $("input[name=cnpj]").val();

	// no ajax estou passando os dois, tanto o array quanto a string
	$.ajax({
		type: "POST",
		url: "getDadosOracle.php",
		data: {inscricao: inscricao, cnpj : cnpj},
		dataType: "json",
		async: false
	}).done(function(data){
		//alert("veja na resposta do navegador do navegador, acho que deu certo.");
		// aqui vc trata o retorno
		if(data){
		    //alert('ok');
			return(trataContribuinte(data));
		} else {
			alert('Erro ao consultar o endereço no SIM');			
			return false;
		}
	   
	});
}

function trataContribuinte(cadastro){
	if (cadastro.linha.length >= 1){
		 document.formulario.nome.value = cadastro.linha[0].NOME_CONTRIBUINTE.trim();
		 document.formulario.cartografico.value = cadastro.linha[0].CARTOGRAFICO.trim();
		 document.formulario.tipo_logradouro.value = cadastro.linha[0].TIPO_LOGRADOURO.trim();
		 document.formulario.logradouro.value = cadastro.linha[0].LOGRADOURO.trim();
		 document.formulario.num_imovel.value = cadastro.linha[0].NUMERO.trim();
		 if (cadastro.linha[0].COMPLEMENTO.trim().length > 0){
		   document.formulario.complemento.value = cadastro.linha[0].COMPLEMENTO.trim();
         }		   
		 document.formulario.bairro.value = cadastro.linha[0].BAIRRO.trim();	
		 document.formulario.cidade.value = cadastro.linha[0].MUNICIPIO.trim();	
		 document.formulario.uf.value = cadastro.linha[0].UF.trim();	
		 document.formulario.cep.value = cadastro.linha[0].CEP.trim();	
         FormataCep(document.formulario.cep);
         buscaCNAEsEmpresa('contribuinte')
		 buscaSociosEmpresa('contribuinte');			 	 
         return true;
	}else{
		$("input[name=inscricao_municipal]").focus();
		alert("Inscrição Municipal combinada com o CNPJ, não localizado.");
		return false;
	}
}

function buscaCNAEsEmpresa(tipoConsulta){

var inscricao =  $("input[name=inscricao_municipal]").val();
var cnae = 'S';
if (document.getElementById('natureza1').checked == false){
    if(tipoConsulta == 'contribuinte'){
		$("input[type=text][id='cnae']").each(function(){
			$(this).val("");
		});
		
		$("input[type=text][id='cnae_dt_inicio']").each(function(){
			$(this).val("");
		});	
		
		$("input[type=text][id='cnae_dt_fim']").each(function(){
			$(this).val("");
		});
		$("input[type=checkbox][id='encerramento']").each(function(){
			$(this).prop('checked', false);
		});		
    }
	// no ajax estou passando os dois, tanto o array quanto a string
	$.ajax({
		type: "POST",
		url: "getDadosOracle.php",
		data: {inscricao_iss: inscricao, cnae : cnae},
		dataType: "json",
		async: false
	}).done(function(data){
		//alert("veja na resposta do navegador do navegador, acho que deu certo.");
		// aqui vc trata o retorno
		if(data){
			//console.log(data.linha[0].denominacao.trim());
		    //alert('ok');
			
			//varifica se a IM informada é de obra. Se for nao permite fazer alteração
			if (data.linha.length >= 1){ 
				 var i = 0;
				 for(i in data.linha){ 
				   var item = data.linha[i]; 
					if(item.COD_ATIVIDADE.localeCompare('4120-4/00-09') == 0){//verifica se cnae do formulário possui correspondência no banco
						alert("A inscrição informada é de obra, utilize o formulario de DIC específico para obras.");
						$("input[name=inscricao_municipal]").val("");
					}
					i = i+1;
				 }
			}
				
				
			
			if(tipoConsulta == 'contribuinte'){
			  return(exibirCNAEsEmpresa(data));
			}else{
			  return(atualizaDataCnae(data));	
			}
		} else {
			alert('Erro ao consultar os CNAEs no SIM');			
			return false;
		}
	   
	});
}else{
  return(atualizaDataCnae(JSON.parse('{"linha":[]}')));	
}	
}


function atualizaDataCnae(cnaes){
	var achou , cnae_formulario, posicao, campo;
	posicao = 1;	
	$("input[type=text][id='cnae']").each(function(){//percorrer todos os CNAEs do formulario
		achou = false;
		cnae_formulario = $(this).val().trim();
		if (cnae_formulario.length > 0){			
			if (cnaes.linha.length >= 1){
				 var contador_reg = 1;
				 for(i in cnaes.linha){
				   var item = cnaes.linha[i];
					if(item.COD_ATIVIDADE.localeCompare(cnae_formulario) == 0){//verifica se cnae do formulário possui correspondência no banco
						achou = true;
					}
				   contador_reg = contador_reg + 1;
				 }	
				 if (!achou){//se não existe no banco, atualiza dt_inicio e dt_fim
				   campo = document.formulario.elements["cnae"+posicao+"_"+'dt_inicio'];// exemplo: cnae1_dt_inicio; cnae13_dt_fim 
				   if(campo.value.trim().length > 0){
				     campo.value = $("#alteracao_data_topo").val();
                   }					 
				 }
			}else{
			   campo = document.formulario.elements["cnae"+posicao+"_"+'dt_inicio'];// exemplo: cnae1_dt_inicio; cnae13_dt_fim 
			   if(campo.value.trim().length > 0){
				 campo.value = $("#alteracao_data_topo").val();
			   }	 
			}
			   campo = document.formulario.elements["cnae"+posicao+"_"+'dt_fim'];// exemplo: cnae1_dt_inicio; cnae13_dt_fim 
			   if(campo.value.trim().length > 0){
				 campo.value = $("#alteracao_data_topo").val();	
			   }				
		}
        posicao = posicao + 1;		
	});	
	return true;	
}

function validaDataCnae(){
	var data_invalida , cnae_formulario, data_inicio, data_fim, campo_inicio, campo_fim, seq_cnae, campo;
	
	data_invalida = false;
	
	$("input[type=text][id='cnae']").each(function(){//percorrer todos os CNAEs do formulario
		cnae_formulario = $(this).val().trim();
		if (cnae_formulario.length > 0){
			campo = $(this).attr('name');
	        seq_cnae = campo.substring(4,campo.length);	
            campo_inicio = document.formulario.elements["cnae"+seq_cnae+"_"+'dt_inicio'];// exemplo: cnae1_dt_inicio; cnae13_dt_fim 	
            campo_fim    = document.formulario.elements["cnae"+seq_cnae+"_"+'dt_fim'];// exemplo: cnae1_dt_inicio; cnae13_dt_fim 

			if(campo_fim.value.length >0){
				data_inicio = campo_inicio.value.substring(6, 10) + campo_inicio.value.substring(3, 5) + campo_inicio.value.substring(0, 2);		
				data_fim = campo_fim.value.substring(6, 10) + campo_fim.value.substring(3, 5) + campo_fim.value.substring(0, 2);		
				if (data_inicio > data_fim){
					 data_invalida = true;
				}
			}			
		}	
	});	
	
	if (!data_invalida){
		return true;
	}else{
		return false;
	}	
}

function exibirCNAEsEmpresa(cnaes){
	if (cnaes.linha.length >= 1){
		 var contador_reg = 1
		 for(i in cnaes.linha){
		   var item = cnaes.linha[i];
		   if (contador_reg > 2){
		     adicionaLinhaCNAE('BLOCO_CNAE');	   
		   }
		   campo = document.formulario.elements["cnae"+contador_reg];// exemplo: cnae1_dt_inicio; cnae13_dt_fim 
		   campo.readOnly = true;
		   campo.value = item.COD_ATIVIDADE.trim();	   
		   campo = document.formulario.elements["cnae"+contador_reg+"_"+'dt_inicio'];// exemplo: cnae1_dt_inicio; cnae13_dt_fim 
		   campo.value = item.DATA_INICIO_ATIVIDADE.trim();
		   if (document.getElementById('natureza3').checked  == true){
			   campo = document.formulario.elements["cnae"+contador_reg+"_"+'dt_fim'];// exemplo: cnae1_dt_inicio; cnae13_dt_fim 
			   campo.value = $("#alteracao_data_topo").val();		   
			   $("input[name=encerramento"+contador_reg+"]").prop("checked", true);
			   $("input[name=encerramento"+contador_reg+"]").prop("disabled", true);
		   }
		   if (item.IND_PRINCIPAL == 'S'){
			   campo = document.formulario.elements["principal"+contador_reg];
			   campo.checked = true;
		   }
		   contador_reg = contador_reg + 1;
		 }		 
        return true;
	}else{
		alert("CNAE(s) não localizado.");
		return false;
	}
}

function limpaCamposSocios(flag){
var formulario;
formulario = document.getElementsByTagName("input");
campos = new Array ('nome','cpf','cep','endereco','numero','complemento','bairro','municipio', 'uf', 'telefone','email');
var NameForm = document.formulario;

	for(var i=0;i <= formulario.length -1;i++){
		if(typeof(formulario[i] == "object")){
			if((formulario[i].getAttribute('type') == 'radio')&&(formulario[i].id=='operacao')){
                if(formulario[i].value == '1'){
					formulario[i].checked = true;
				}else{
					formulario[i].checked = false;
				}	
				if(flag){
					prefixo = formulario[i].name.substring(0,formulario[i].name.length - 9);
					for( var w = 0; w < campos.length ; w++){
						var campo = NameForm.elements[prefixo+"_"+campos[w]];     
						campo.value = "";
						
					}
				}
			}       
		}
	}	
}

function buscaSociosEmpresa(tipoConsulta){
var inscricao =  $("input[name=inscricao_municipal]").val();
var socio = 'S';
	if (document.getElementById('natureza1').checked == false){
		if(tipoConsulta == 'contribuinte'){
			limpaCamposSocios(true);
		}
		// no ajax estou passando os dois, tanto o array quanto a string
		$.ajax({
			type: "POST",
			url: "getDadosOracle.php",
			data: {inscricao_iss: inscricao, socio : socio},
			dataType: "json",
			async: false
		}).done(function(data){
			// aqui vc trata o retorno
			if(data){
				console.log(data);
				//console.log(data.linha[0].denominacao.trim());
				//alert('ok');
				if(tipoConsulta == 'contribuinte'){
				  return(exibirSociosEmpresa(data));
				  return true;
				}
			} else {
				alert('Erro ao consultar os Sócios no SIM');			
				return false;
			}
		   
		});
	}
}

function exibirSociosEmpresa(socios){
var formulario;
formulario = document.getElementsByTagName("input");
campos = new Array ('nome','cpf','cep','endereco','numero','complemento','bairro','municipio', 'uf', 'telefone','email');
var NameForm = document.formulario;	
var numTotal = document.getElementById('numTotal').value;
	if (socios.linha.length >= 1){
		 var contador_reg = 1
		for(i in socios.linha){
			var item = socios.linha[i];
			if (contador_reg > numTotal){
				adicionaLinha('BLOCO');			 
			}			 

			
			
			NameForm.elements['c'+contador_reg+"_"+campos[0]].value = item.NOME_SOCIO; 
			NameForm.elements['c'+contador_reg+"_"+campos[1]].value = item.CPF_CNPJ_SOCIO;
			NameForm.elements['c'+contador_reg+"_"+campos[2]].value = item.CEP;
			FormataCep(NameForm.elements['c'+contador_reg+"_"+campos[2]]);
			NameForm.elements['c'+contador_reg+"_"+campos[3]].value = item.LOGRADOURO;
			NameForm.elements['c'+contador_reg+"_"+campos[4]].value = item.NUMERO;
			NameForm.elements['c'+contador_reg+"_"+campos[5]].value = item.COMPLEMENTO;
			NameForm.elements['c'+contador_reg+"_"+campos[6]].value = item.BAIRRO;
			NameForm.elements['c'+contador_reg+"_"+campos[7]].value = item.MUNICIPIO;
			NameForm.elements['c'+contador_reg+"_"+campos[8]].value = item.UF;	
			NameForm.elements['c'+contador_reg+"_"+campos[9]].value = mtel(item.TELEFONE);
			NameForm.elements['c'+contador_reg+"_"+campos[10]].value = item.EMAIL;	
	
			contador_reg = contador_reg + 1;
		}
        if(contador_reg > 5){
			mostra('link');
			limpaCamposSocios(false);
		}		
	}
	return true;	
}

function alteraDataEncerramento(campo){
  //alert("alteraDataEncerramento");	
  posicao = campo.name.substring(12,campo.name.length);
  campo_data_fim = document.formulario.elements["cnae"+posicao+"_"+'dt_fim'];// exemplo: cnae1_dt_inicio; cnae13_dt_fim 
  campo_cnae = document.formulario.elements["cnae"+posicao];// exemplo: cnae1_dt_inicio; cnae13_dt_fim 
  if($("input[name=alteracao_data_topo]").val().trim().length > 0){
	  if(campo.checked){
		if(campo_cnae.value != ''){
		  $("input[name="+campo_data_fim.name+"]").val($("input[name=alteracao_data_topo]").val());
		}else{
		  campo.checked = false;
		}  
	  }else{
		if(document.getElementById('natureza3').checked  == false){
			$("input[name="+campo_data_fim.name+"]").val("");
		}else{
			campo.checked = true;
			$("input[name="+campo_data_fim.name+"]").val($("input[name=alteracao_data_topo]").val());
		}		
	  }
  }else{
	campo.checked = false;  
  }
}

function setPosCnaePrincipal(){
	var radios = document.getElementsByName("principal");
	var contador = 1;
	for (var i = 0; i < radios.length; i++) {
		if (radios[i].checked) {
			document.formulario.pos_cnae_principal.value = contador;
		}
		contador = contador + 1;
	}		
}

function verificaCnaePrincipal(){
	var radios = document.getElementsByName("principal");
	var contador = 0;
	for (var i = 0; i < radios.length; i++) {
		if (radios[i].checked) {
			contador = contador + 1;
		}		
	}
    if(contador == 1){
		return true;
	}else{
		return false;
	}	
}

function verificaCnaePrincipalEncerrado(){
	var radios = document.getElementsByName("principal");
	var cnaePrincipalEncerrado = false;
	for (var i = 0; i < radios.length; i++) {
		if (radios[i].checked) {
        	var campo_data_fim = document.formulario.elements["cnae"+(i+1)+"_"+'dt_fim'];// exemplo: cnae1_dt_inicio; cnae13_dt_fim 
            var campo_cnae = document.formulario.elements["cnae"+(i+1)];// exemplo: cnae1_dt_inicio; cnae13_dt_fim 			
			if ((campo_data_fim.value != "") || (campo_cnae.value =="")){
			  cnaePrincipalEncerrado = true;	
			}
		}		
	}
    if((cnaePrincipalEncerrado) && (document.getElementById('natureza3').checked  == false)){
		return false;
	}else{
		return true;
	}	
}
	function adicionaLinhaCNAE(divName) {
		var bloquear = '';
		var iCount = document.getElementById('numero_cnae').value;
		if(iCount > 1){
		  var campo_cnae = document.formulario.elements["cnae"+(iCount-1)];// exemplo: cnae1_dt_inicio; cnae13_dt_fim
		  if(campo_cnae.value == ""){
			  alert("O formulário possui campos de CNAE livres para preenchimento");
			  return false;
		  }
        }
		var desabilitar = '';
        if (document.getElementById('natureza1').checked == true){
			desabilitar = "disabled";
		}			
		var newDiv = document.createElement("div");
		newDiv.setAttribute('id','LINHA'+iCount); 
		var campo = "";
			campo += "<table width='700'>";		
			campo += "<tr>";
			campo += "	<td style='width:50%'>";		
			campo += "      <input type='text' name='cnae"+iCount+"' id='cnae'";
			campo += "		value=''";
			campo += "		maxlength='12' size='12' onBlur='validacnae(this);'";
			campo += "		onKeyPress='return verificaNumero(event);'";
			campo += "		onKeyUp='return FormataCodae(this);'/> &nbsp; &nbsp;";
			campo += "	</td>";			
			campo += "  <td style='width:10%' align='center'><input type='radio' name='principal' id='principal"+iCount+"'></td>";
			campo += "	<td style='width:20%'>";
			campo += "      <input type='text' name='cnae"+iCount+"_dt_inicio' id='cnae_dt_inicio' readOnly";
			campo += "		value=''";
			campo += "		maxlength='10' size='10' onKeyPress='return verificaNumero(event)'";
			campo += "		onKeyUp='return FormataData(this);' />";
			campo += "	</td>";
			campo += "	<td style='width:20%'>";
			campo += "      <input type='checkbox' name='encerramento"+iCount+"' id='encerramento' onClick='alteraDataEncerramento(this)'";
			campo +=  desabilitar+ "/>";			
			campo += "	    <input type='text' name='cnae"+iCount+"_dt_fim' id='cnae_dt_fim' readOnly";
			campo += "		value=''";
			campo += "		maxlength='10' size='10' onKeyPress='return verificaNumero(event)'";
			campo += "		onKeyUp='return FormataData(this);' />";
			campo += "  </td>";
		    campo += "</tr>";
			campo += "</table>";			
		var camposTexto = document.getElementById(divName);
		newDiv.innerHTML = campo;
		camposTexto.appendChild(newDiv);
		iCount++;
		document.getElementById('numero_cnae').value = iCount;
		document.getElementById('numtotal_cnae').value = iCount-1;
	}
	
	
	function adicionaLinha(divName) {
		var iCount = document.getElementById('numero').value;
		var newDiv = document.createElement("div");
		newDiv.setAttribute('id','LINHA'+iCount); 
		var campo = "";
			campo += "<table width='700'>";
				campo += "<tr>";
					//campo += "<td style='background-color:#CCCCCC'>&nbsp;<b>"+iCount+"<input type='hidden' name='numero' id='numero' value='numero'></b></td>";
						campo += "<td style='background-color:#CCCCCC'>&nbsp;<b>"+iCount+"</b></td>";
						campo += "<td colspan='2'>";
							campo += "<table width='100%'>";
								campo += "<tr>";
									campo += "<td><input type='radio' name='c"+iCount+"_operacao' id='operacao' value='1'>Sem alteração</td>";
									campo += "<td><input type='radio' name='c"+iCount+"_operacao' id='operacao' value='2'>Inclusão</td>";
									campo += "<td><input type='radio' name='c"+iCount+"_operacao' id='operacao' value='3'>Exclusão</td>";
									campo += "<td><input type='radio' name='c"+iCount+"_operacao' id='operacao' value='4'>Endereço</td>";												
								campo += "</tr>";
							campo += "</table>";
			 			campo += "</td>";		
								campo += "</tr>";
								campo += "<tr>";	
									campo += "<td colspan='2'>Nome/Nome Empresarial:<br/><input type='text' name='c"+iCount+"_nome' value='' maxlength='40' size='59' onkeypress='verificaOperacao(document.formulario.c"+iCount+"_operacao);'/></td>";
									campo += "<td>CPF/CNPJ:<br/><input type='text' name='c"+iCount+"_cpf' value='' maxlength='18' size='18' onkeypress='verificaOperacao(document.formulario.c"+iCount+"_operacao);' onblur='if (this.value != \"\") if (verificaCpfCnpj(this)) this.focus();'/></td>";							
								campo += "</tr>";
								campo += "<tr>";
									campo += "<td>CEP:<br><input type='text' name='c"+iCount+"_cep' value='' maxlength='10' size='10' onkeypress='verificaOperacao(document.formulario.c"+iCount+"_operacao); return verificaNumero(event);' onkeyup='return FormataCep(this);'></td>";	
									campo += "<td>Endereço:<br><input type='text' name='c"+iCount+"_endereco' value='' maxlength='40' size='35' onkeypress='verificaOperacao(document.formulario.c"+iCount+"_operacao);'></td>";
									campo += "<td>Número do Imóvel:<br><input type='text' name='c"+iCount+"_numero' value='' maxlength='5' size='5' onkeypress='verificaOperacao(document.formulario.c"+iCount+"_operacao);'></td>";		
								campo += "</tr>";
								campo += "<tr>";
									campo += "<td>Complemento:<br><input type='text' name='c"+iCount+"_complemento' value='' maxlength='20' size='20' onkeypress='verificaOperacao(document.formulario.c"+iCount+"_operacao);'></td>";	
									campo += "<td>Bairro:<br><input type='text' name='c"+iCount+"_bairro' value='' maxlength='35' size='35' onkeypress='verificaOperacao(document.formulario.c"+iCount+"_operacao);'></td>";										
								
									campo += "<td>Município:<br><input type='text' name='c"+iCount+"_municipio' value='' maxlength='35' size='20' onkeypress='verificaOperacao(document.formulario.c"+iCount+"_operacao);'></td>";
									campo += "</tr>";
									campo += "<tr>";
										campo += "<td>Estado:<br>";
											campo += "<select name='c"+iCount+"_uf' size='1' style='width:150' onchange='verificaOperacao(document.formulario.c1_operacao);'>"; // width:280
												campo += "<option value='' selected=''>&nbsp;</option>";
												campo += "<option value='AC'>Acre</option>";
												campo += "<option value='AL'>Alagoas</option>";
												campo += "<option value='AM'>Amazonas</option>";
												campo += "<option value='AP'>Amapa</option>";
												campo += "<option value='BA'>Bahia</option>";
												campo += "<option value='CE'>Ceara</option>";
												campo += "<option value='DF'>Distrito Federal</option>";
												campo += "<option value='ES'>Espirito Santo</option>";
												campo += "<option value='GO'>Goias</option>";
												campo += "<option value='MA'>Maranhao</option>";
												campo += "<option value='MG'>Minas Gerais</option>";
												campo += "<option value='MS'>Mato Grosso do Sul</option>";
												campo += "<option value='MT'>Mato Grosso</option>";
												campo += "<option value='PA'>Para</option>";
												campo += "<option value='PB'>Paraiba</option>";
												campo += "<option value='PE'>Pernambuco</option>";
												campo += "<option value='PI'>Piaui</option>";
												campo += "<option value='PR'>Paraná</option>";
												campo += "<option value='RJ'>Rio de Janeiro</option>";
												campo += "<option value='RN'>Rio Grande do Norte</option>";
												campo += "<option value='RO'>Rondonia</option>";
												campo += "<option value='RR'>Roraima</option>";
												campo += "<option value='RS'>Rio Grande do Sul</option>";
												campo += "<option value='SC'>Santa Catarina</option>";
												campo += "<option value='SE'>Sergipe</option>";
												campo += "<option value='SP'>São Paulo</option>";
												campo += "<option value='TO'>Tocantins</option>";
											campo += "</select>";
										campo += "</td>";			
										campo += "<td>DDD/Telefone:<br><input type='text' name='c"+iCount+"_telefone' value='' maxlength='14' size='14' onkeypress='verificaOperacao(document.formulario.c"+iCount+"_operacao); return verificaNumero(event);' onKeyUp='return ddd_Tel(this);' style='text-align: right;'></td>";
					                	campo += "<td colspan='2'>E-mail:<br/><input type='text' name='c"+iCount+"_email' value='' maxlength='60' size='30' onkeypress='verificaOperacao(document.formulario.c"+iCount+"_operacao);'></td>";
				           			campo += "</tr>";
			campo += "</table>";
		var camposTexto = document.getElementById(divName);
		newDiv.innerHTML = campo;
		camposTexto.appendChild(newDiv);
		iCount++;
		document.getElementById('numero').value = iCount;
		document.getElementById('numTotal').value = iCount-1;
	}

<!-- ********* Final do Bloco de Atualização ********* -->


var g_cnae = '';
function habilita_manual(){ 
  if (document.formulario.endereco_manual.checked){
	  desabilitaCEPeCartografico(false);
	  bloqueiaCamposEndereco(false);	  
	  document.formulario.tipo_logradouro.disabled= false;
	  document.formulario.logradouro.readOnly= false;
      document.formulario.bairro.readOnly= false;	
      document.formulario.cidade.readOnly= false;	 
      document.formulario.uf.disabled= false;	  
      //alert('checado');	  
   }
   else {  
      limparEndereco();
	  document.formulario.tipo_logradouro.disabled= true;
	  document.formulario.logradouro.readOnly= true;
      document.formulario.bairro.readOnly= true;	
      document.formulario.cidade.readOnly= true;	 
      document.formulario.uf.disabled= true;	   
      //alert('não checado');		  
   }
}

function limparEndereco(){
  document.formulario.num_imovel.value = '';
  desabilitaCEPeCartografico(false);
  bloqueiaCamposEndereco(false);
  limpaEndereco('cartografico');
  limpaEndereco('cep');  
}

function desabilitaCEPeCartografico(flag){
	document.formulario.cartografico.disabled=  flag;	
	document.formulario.cep.disabled=  flag;
    document.formulario.num_imovel.disabled=  flag;	
}

function bloqueiaCamposEndereco(flag){
	document.formulario.num_imovel.readOnly =  flag;
	document.formulario.complemento.readOnly =  flag;
	document.formulario.cartografico.readOnly=  flag;	
	document.formulario.cep.readOnly=  flag;	
}

function carregaCartografico(cartografico, radio_selecionado){
  if (confirm('Complemento selecionado: ' + cartografico.substring(cartografico.indexOf("|")+1, cartografico.length))){
    document.formulario.cartografico.value = cartografico.substring(0, cartografico.indexOf("|"));
    document.formulario.complemento.value = cartografico.substring(cartografico.indexOf("|")+1, cartografico.length);
	$('#panelComplemento').hide();
	bloqueiaCamposEndereco(true);
	desabilitaCEPeCartografico(true);
  }
}

function habilitaCamposParaSalvar(){
  //limpa campos
  document.formulario.tipo_logradouro.disabled = false;	
  document.formulario.uf.disabled = false;
  document.formulario.cartografico.disabled=  false;	
  document.formulario.cep.disabled=  false;	
  document.formulario.num_imovel.disabled=  false;	
  $("#alteracao_data_topo").prop("disabled", false);
  document.getElementById('natureza1').disabled = false;
  document.getElementById('natureza2').disabled = false;
  document.getElementById('natureza3').disabled = false;  
  $("input[name=inscricao_municipal]").prop("disabled", false);
}
function limpaEndereco(tipo){
	//limpa campos
	document.formulario.tipo_logradouro.value = ''
	document.formulario.logradouro.value = '';
	document.formulario.bairro.value= '';
	document.formulario.cidade.value= '';
	document.formulario.uf.value= ''; 
	//document.formulario.num_imovel.value = '';
	document.formulario.complemento.value = '';
	if (tipo == "cep"){
	  document.formulario.cartografico.value= '';	
	}  
	if (tipo == "cartografico"){
	  document.formulario.cep.value= '';	
	}  
	bloqueiaCamposEndereco(false);
	$('#panelComplemento').hide();
	$('#divDireita').html('');
	$('#divEsquerda').html('');
}

function limpaEndereco_onBlur(tipo){
  var numsStr = document.formulario.cep.value.replace(/[^0-9]/g,'');		
  if (! document.formulario.endereco_manual.checked){	
	//limpa campos
	document.formulario.tipo_logradouro.value = ''
	document.formulario.logradouro.value = '';
	document.formulario.bairro.value= '';
	document.formulario.cidade.value= '';
	document.formulario.uf.value= ''; 
	//document.formulario.num_imovel.value = '';
	document.formulario.complemento.value = '';
	if (tipo == "cep"){
	  document.formulario.cartografico.value= '';			
	  if (numsStr != ""){	
		  if (!(numsStr >= "13010000" && numsStr <= "13189999")){
			document.formulario.cep.value= '';
			alert('O campo CEP só aceita valores entre 13010-000 e 13189-999');
		  }	 
	  }	  
	}  
	if (tipo == "cartografico"){
	  document.formulario.cep.value= '';	
	}  
	bloqueiaCamposEndereco(false);
	$('#panelComplemento').hide();
	$('#divDireita').html('');
	$('#divEsquerda').html('');
  }else 
	  if (document.formulario.endereco_manual.checked){
	    	if (tipo == "cep"){
	            if (numsStr != ""){					
					if (!(numsStr >= "13010000" && numsStr <= "13189999")){
						if($("input[name=sp_usuario]").val() != '781967'  && $("input[name=sp_usuario]").val() != '1316052'){
							document.formulario.cep.value= '';
							alert('O campo CEP só aceita valores entre 13010-000 e 13189-999');
						}
					}
					else {
						 if (document.formulario.num_imovel.value != ""){
						   buscaEndereco(document.formulario.cep.value, tipo,document.formulario.num_imovel.value.trim());
						 }
						 else {
						  buscaEndereco(document.formulario.cep.value, tipo,'N');	 
						 }
					}
				}
			}	
	  }
}
function preencheEndereco_onBlur(tipo){ 
  //limpaEndereco(tipo);
  if (document.formulario.endereco_manual.checked == false){
    preencheEndereco(tipo);
  }  
}

function preencheEndereco(tipo){ 
  //limpaEndereco(tipo);
  if (tipo == "cep" && document.formulario.num_imovel.value != ""){
	buscaEndereco(document.formulario.cep.value, tipo, document.formulario.num_imovel.value.trim());
  }	
  if (tipo == "cep" && document.formulario.num_imovel.value == ""){
	buscaEndereco(document.formulario.cep.value, tipo, 'N');
	//alert("Preencha o campo Número do imóvel.")
  }	  
  if (tipo == "cartografico"){
	if(document.formulario.cartografico.value.length < 21){/*formata cartografico*/
	  var temp = document.formulario.cartografico.value; 
	  document.formulario.cartografico.value =	temp.substring(0,4)+'.'+temp.substring(4,6)+'.'+temp.substring(6,8)+'.'+temp.substring(8,12)+'.'+temp.substring(12,17);
	}	  
	buscaEndereco(document.formulario.cartografico.value,tipo,'N');
  }
}

function buscaEndereco(str, tipo,numero) {
    if (str == "") {
        return;
    } else { 
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				var retorno = xmlhttp.responseText;
				retorno = '{"linha":'+retorno.trim()+'}';
				console.log(retorno);
				if (retorno.indexOf("ErroDeConexao") != -1){//erro de conexão ao bd
				  alert("Problemas de conexão. Tente mais tarde.");
			    }
				else{	
				  var objeto = JSON.parse(retorno.trim());
				  if (tipo == "cep" && numero != 'N')
			        preencheCamposEndereco(objeto,"cep", numero);				  
				  else if (tipo == "cep" && numero == 'N')
			        preencheCamposEndereco(objeto,"cep", numero);
				  else if (tipo == "cartografico", numero)
			        preencheCamposEndereco(objeto,"cartografico");				
				}
            }
        };
		if (tipo == "cep" && numero != 'N'){
          xmlhttp.open("POST","getDadosOracle.php?cep="+str+'&numero='+numero,true);
		}  		
		if (tipo == "cep" && numero == 'N'){
          xmlhttp.open("POST","getDadosOracle.php?cep="+str,true);
		}  
		if (tipo == "cartografico"){
          xmlhttp.open("POST","getDadosOracle.php?cartografico="+str,true);
		}  
        xmlhttp.send();
    }
}

function preencheCamposEndereco(endereco,tipo, numero){
	var esquerda = "", direita ="";
	if (tipo == "cep" && numero != 'N'){//com numero
	 if (endereco.linha.length > 1){
		var radios = "";
		var radios = '<h3 align="Center">ATEN&Ccedil;&Atilde;O: SELECIONE O COMPLEMENTO</h3>';
		var contador_reg = 1, qtd_reg = endereco.linha.length, coluna = 1;
		for(i in endereco.linha){
			if (coluna == 3) {coluna = 1;}
			var item = endereco.linha[i];
            if (item.complemento.length > 0){
              if (coluna == 1)				
		  	     esquerda = esquerda + '<input type="radio" name="complemento_radio" value="'+item.cartografico+'|'+item.complemento+'">'+ item.complemento+' <br/>';
              else	
                  direita = direita +  '<input type="radio" name="complemento_radio" value="'+item.cartografico+'|'+item.complemento+'">'+ item.complemento+' <br/>';			  
			}else{
			  if (coluna == 1)		
			    esquerda = esquerda + '<input type="radio" name="complemento_radio" value="'+item.cartografico+'|'+'">'+ ''+' <br/>';	
			  else
				direita = direita + ' <input type="radio" name="complemento_radio" value="'+item.cartografico+'|'+'">'+ ''+'<br/>';
			}
			coluna = coluna + 1;
			contador_reg = contador_reg + 1;
		}
		$('#divDireita').html(direita);
		$('#divEsquerda').html(esquerda);
		
		divDireita.innerHTML = direita;
		divEsquerda.innerHTML = esquerda;		
        //document.formulario.complemento.click();
        //document.formulario.complemento.focus();		
	 }
	 
	 if (endereco.linha.length >= 1){	
		 document.formulario.tipo_logradouro.value = endereco.linha[0].tipo_logradouro.trim();
		 document.formulario.logradouro.value = endereco.linha[0].nome_logradouro.trim();
		 document.formulario.num_imovel.value= endereco.linha[0].numero.trim();		 
		 document.formulario.bairro.value= endereco.linha[0].bairro.trim();
		 document.formulario.cidade.value= endereco.linha[0].cidade.trim();
		 document.formulario.uf.value= endereco.linha[0].uf.trim();
		 if(document.formulario.tipo_logradouro.value== ""){
		    document.formulario.tipo_logradouro.value = "OUTROS";
		 }
		 if (endereco.linha.length == 1){//apenas 1 registro
		   document.formulario.cartografico.value = endereco.linha[0].cartografico.trim();
		   if(endereco.linha[0].numero.trim().length > 0){
		     desabilitaCEPeCartografico(true);
		   }
		   if (endereco.linha[0].complemento.trim().length > 0)
		     document.formulario.complemento.value = endereco.linha[0].complemento.trim();	 
		 }else{        
		       $("#panelComplemento").css("display", "block");	
	     }
		 if (document.formulario.endereco_manual.checked){
			 document.formulario.endereco_manual.checked = false;
			 document.formulario.tipo_logradouro.disabled= true;
			 document.formulario.logradouro.readOnly= true;
			 document.formulario.bairro.readOnly= true;	
			 document.formulario.cidade.readOnly= true;	 
			 document.formulario.uf.disabled= true;	
			 preencheEndereco('cep');
			 alert('CEP informado existe na Base de Dados.');
		 }
	 }else{
		 if (!document.formulario.endereco_manual.checked){
			 //document.formulario.cep.value = "";
			 bloqueiaCamposEndereco(false);
			 buscaEndereco(document.formulario.cep.value, tipo, 'N');
			 document.formulario.cartografico.value= '';
			 alert("Não existe código cartográfico para o CEP e o número de imóvel informados.\nInforme o complemento do endereço, se houver, e prossiga com o preenchimento do DIC."); 
		 }
	 }
	}	
	if (tipo == "cep" && numero == 'N'){//sem número
     if (endereco.linha.length >= 1){			
		 document.formulario.tipo_logradouro.value = endereco.linha[0].tipo_logradouro.trim();
		 document.formulario.logradouro.value = endereco.linha[0].nome_logradouro.trim();
		 document.formulario.bairro.value= endereco.linha[0].bairro.trim();
		 document.formulario.cidade.value= endereco.linha[0].cidade.trim();
		 document.formulario.uf.value= endereco.linha[0].uf.trim();
		 if(document.formulario.tipo_logradouro.value== ""){
		    document.formulario.tipo_logradouro.value = "OUTROS";
		 }
		 document.formulario.cep.disabled= true;
		  if (endereco.linha.length == 1){
		    document.formulario.cartografico.value = endereco.linha[0].cartografico.trim();	
			if(endereco.linha[0].numero.trim().length > 0){
			  document.formulario.num_imovel.value= endereco.linha[0].numero.trim();
			  desabilitaCEPeCartografico(true);
			}
			if (endereco.linha[0].complemento.trim().length > 0){
		       document.formulario.complemento.value = endereco.linha[0].complemento.trim();
            }else{	
               document.formulario.complemento.value = 	'';
            }			   
		  }else{
			  document.formulario.cartografico.value= '';
		  }
           		  
		 if (document.formulario.endereco_manual.checked){
			 document.formulario.endereco_manual.checked = false;
			 document.formulario.tipo_logradouro.disabled= true;
			 document.formulario.logradouro.readOnly= true;
			 document.formulario.bairro.readOnly= true;	
			 document.formulario.cidade.readOnly= true;	 
			 document.formulario.uf.disabled= true;
			 preencheEndereco('cep');
			 alert('CEP informado existe na Base de Dados.');
		 }		 
	 }else{
		 if (!document.formulario.endereco_manual.checked){
			 document.formulario.cep.value = "";
			 bloqueiaCamposEndereco(false);
			 document.formulario.num_imovel.value= '';
			 alert("CEP informado não é de Campinas ou não está cadastrado na banco de dados."); 
		 }
	 }
	}
	if (tipo == "cartografico"){	
	 if (endereco.linha.length >= 1){
		 document.formulario.tipo_logradouro.value = endereco.linha[0].tipo_logradouro.trim();
		 document.formulario.logradouro.value = endereco.linha[0].nome_logradouro.trim();
		 document.formulario.bairro.value= endereco.linha[0].bairro.trim();
		 document.formulario.cidade.value= endereco.linha[0].cidade.trim();
		 document.formulario.uf.value= endereco.linha[0].uf.trim();
		 document.formulario.cep.value= endereco.linha[0].cep.trim();
		 document.formulario.num_imovel.value = endereco.linha[0].numero.trim();
		 if (endereco.linha[0].complemento.trim().length > 0)
		   document.formulario.complemento.value = endereco.linha[0].complemento.trim();		 
		 if(document.formulario.tipo_logradouro.value== ""){
		    document.formulario.tipo_logradouro.value = "OUTROS";
		 }
		 FormataCep(document.formulario.cep);
		 document.formulario.endereco_manual.checked = false;
		 bloqueiaCamposEndereco(true);
		 desabilitaCEPeCartografico(true);
	 }else{
		 document.formulario.cartografico.value = "";
		 bloqueiaCamposEndereco(false);
		 document.formulario.num_imovel.value= '';
		 alert("Código cartográfico informado inexistente."); 
	 }
	}	
}

function verificaRepetidos(){
var log_erro = "";
var arrCampos = new Array();	
var arrDuplicados = new Array();
var contador = 0;
var posicao = 0;	
	$("input[type=text][id='cnae']").each(function(){
		arrCampos.push($(this).val());
	});
	var arrCamposCopia = arrCampos.slice(0);
	
	for(i=0;i<arrCampos.length;i++){//percorre todos os cnaes informados
		cnae = arrCampos[i];
		if(cnae != ''){
			contador = 0;		
			for(j=0;j<arrCamposCopia.length;j++){	
				if(arrCamposCopia[j].localeCompare(cnae) == 0){//verifica se cnae informada possui correspondência no banco
				  contador++;
				}
			}	
			if (contador > 1){
				posicao = arrDuplicados.lastIndexOf(cnae);
				if(posicao == -1){
				  arrDuplicados.push(cnae);
				}
			}
		}
	}
	if (arrDuplicados.length > 0){	
        for(w=0;w<arrDuplicados.length;w++){
			log_erro = log_erro + arrDuplicados[w] +" ";
		}	
		alert("Os CNAEs listados abaixo, estão repetidos:\n\n"+log_erro);
		return false;
	}else{
		return true;
	}
}

function verificaCNAES(){	
   g_cnae = "erro_conexao";

	var strCampos = '';
	var arrCampos = new Array();

	// 1a forma
	// percorre todos os campos com a classe varios_campos
	$('#cnae').each(function(){
		strCampos+= (strCampos!=''?',':'') + $(this).val();
	});

	// outra forma
	$("input[type=text][id='cnae']").each(function(){
		arrCampos.push($(this).val());
	});
	// no ajax estou passando os dois, tanto o array quanto a string
	$.ajax({
		type: "POST",
		url: "getDadosOracle.php",
		data: {strCampos: strCampos, arrCampos : arrCampos},
		dataType: "json",
		async: false
	}).done(function(data){
		//alert("veja na resposta do navegador do navegador, acho que deu certo.");
		// aqui vc trata o retorno
		if(data){
			//console.log(data.linha[0].denominacao.trim());
			return(trataCNAES(data));
			//alert('ok');
		} else {
			alert('Erro ao consultar os CNAEs');			
			return false;
		}
	   
	});
}

function trataCNAES(cnaesBanco){
var erro_cnae = "";
var cnae = '';
var achou = false;
g_cnae = "";
var arrCampos = new Array();	
	if (cnaesBanco.linha.length >= 1){

		$("input[type=text][id='cnae']").each(function(){
			arrCampos.push($(this).val());
		});
		
		for(i=0;i<arrCampos.length;i++){//percorre todos os cnaes informados
			cnae = arrCampos[i];
            if(cnae != ''){			
				achou = false;
				for(j in cnaesBanco.linha){		
					var item = cnaesBanco.linha[j];
					if (item.sub_classe.length > 0){
						if(item.sub_classe.localeCompare(cnae) == 0){//verifica se cnae informada possui correspondência no banco
								achou = true;
						}
					}
				}	
				if (!achou){
					erro_cnae = erro_cnae + cnae+" ";
				}
			}
		}
		
		if (erro_cnae != ""){
			alert("Corrigir os CNAEs listados abaixo:\n\n"+erro_cnae);
			return false;
		}else{
			g_cnae = "sucesso";
			return true;
		} 
         			

	}else{
		alert("Nenhum do(s) CNAE(s) do formulário existe na Base de Dados.");
		return false;
	}
}

function confirma(){

	/* if ((document.formulario.inscricao_municipal.value != "") || 
	     (document.formulario.inscricao_municipal.value.length != 12))
		{
			 alert ("A Incrição Municipal fornecida foi preenchida incorretamente.");
			 document.formulario.inscricao_municipal.focus();
			 return false;
		}
	*/
	 //if (document.formulario.natureza.checked == false)
	 
	 
	  var nulo = 0; 
	  for(var n = 0; n < document.formulario.natureza.length ; n++){
	   if(document.formulario.natureza[n].checked == true){ 
	    nulo = document.formulario.natureza[n].value;
	   }
	 }
	 if(nulo == 0){
	  alert("Selecione a Natureza do Pedido!");
	  document.formulario.natureza[0].focus();
	  return false;
	 }
	 

 	var natureza_pedido = ""; 
 	var num_inscricao = "";
	for(var n = 0; n < document.formulario.natureza.length ; n++){
	   	if(document.formulario.natureza[n].checked == true){ 
		   	if(document.formulario.natureza[n].value == 2){
		   		natureza_pedido = "alteracao";
		   	}else{
			   	if(document.formulario.natureza[n].value == 1){
			   		natureza_pedido = "nova_incricao";
			   		num_inscricao = document.formulario.inscricao_municipal.value;
			   	}
		   	}
 		}
  	}  
	
	if  (document.formulario.alteracao_data_topo.value == ""){		 	
			alert("Informe a data de alteração. (Início do formulário)");
			document.formulario.alteracao_data_topo.focus();
			return false;
	}	
	 // Força informar TIPO e DATA de alteração.
	 	
	 	 if (natureza_pedido == "alteracao"){
 			if( (document.formulario.alteracao_nome.checked 		== false) && 
	 		  	(document.formulario.alteracao_cnpj.checked 		== false) &&
 				(document.formulario.alteracao_endereco.checked 	== false) &&
	 		  	(document.formulario.alteracao_atividade.checked 	== false) &&
	 		  	(document.formulario.alteracao_sociedade.checked 	== false) &&
	 		  	(document.formulario.alteracao_qtde_func.checked 	== false) &&
	 		  	(document.formulario.alteracao_qs.checked 			== false) &&
	 		 	(document.formulario.alteracao_outros.checked 		== false) )	
 		 	{		 	
					alert("Informe o tipo da alteração.");
				    document.formulario.alteracao_nome.focus();
				    return false;
			} 	 
 		 	if  (document.formulario.alteracao_data.value == ""){		 	
					alert("Informe a data de alteração.");
				    document.formulario.alteracao_data.focus();
				    return false;
 			}
	 	}




		 
	// Em caso de abertura de inscrição, não permite ao usuário inserir o Número da Inscrição Municipal. 14/05/2014

	 	if (natureza_pedido == "nova_incricao"){
	 		if(num_inscricao != ""){
	 			alert(" ABERTURA DE INSCRIÇÃO \n\n O Número da Inscrição Municipal, NÃO DEVE SER PREENCHIDO."); 
		 		document.formulario.contribuinte_issqn.focus();
		 		document.formulario.inscricao_municipal.value = "";
			    return false;
	 		}
	 	}
	 
	 /* Inicio Bloco 1 - Alteração Referente a Solicitação de Inclusão de Campo Simples Nacional Jan-Abr/2014 */
	 /* -Sissol 32396/2015 
	 var nulob = 0;
	 for(var n = 0; n < document.formulario.op_simples.length ; n++){
		   if(document.formulario.op_simples[n].checked == true){ 
		    nulob = document.formulario.op_simples[n].value;
		   }
		 }
		 if(nulob == 0){
		  alert("Selecione a Opção do Simples Nacional!");
		  document.formulario.op_simples[0].focus();
		  return false;
		 }*/
	/* Fim Bloco 1 - Alteração Referente a Solicitação de Inclusão de Campo Simples Nacional Jan-Abr/2014 */
	 if(nulo>=2){
		 if (document.formulario.inscricao_municipal.value == ""){
			 alert("Preencha o campo Inscrição Municipal!");
			 document.formulario.inscricao_municipal.focus();
			 return false;
		}
	 }
	 
	 
	 if((!document.formulario.contribuinte_issqn.checked) && (!document.formulario.substituto_issqn.checked)){
	  alert("Selecione o Contribuinte e / ou Substituto Tributário!");
	  document.formulario.contribuinte_issqn.focus();
	  return false;
	 }
	 
	 
	 if (document.formulario.cnpj.value != ""){
		 if (verificaCnpj(document.formulario.cnpj))
		 {
	 		 	document.formulario.cnpj.focus();
		   		return false;
		 } 
	  }
	  else{
	   alert("Preencha o campo cnpj do Contribuinte / Substituto Tributário!");
	   document.formulario.cnpj.focus();
	   return false;
	  }
	//Inscricao Estadual Valida  - XXX.XXX.XXX.XXX - 15 caracteres.
	if (document.formulario.ie.value != ""){
		if (document.formulario.ie.value.length < 15){
 		 	alert("Informe a Inscrição Estadual Completa!");
 		 	document.formulario.ie.focus();
 		 	return false;
	 	}
	}
	
	if (document.formulario.nome.value == ""){
	 		 alert("Preencha o campo Nome Empresarial!");
	 		 document.formulario.nome.focus();
	 		 return false;

	 }

	 var nulo = 0;
	 for(var n = 0; n < document.formulario.area_1000m.length ; n++){
	  if(document.formulario.area_1000m[n].checked == true){
	   nulo = document.formulario.area_1000m[n].value;
	  }
	}
	if(nulo == 0){
	 alert("Informe se possui área consolidada de terreno superior a 1000m2 \n e/ou área construída superior a 1000m2!");
	 document.formulario.area_1000m[0].focus();
	 return false;
	}

	 if (document.formulario.cep.value == ""){
		 alert("Preencha o campo Cep!");
		 document.formulario.cep.focus();
		 return false;

	}
	
	 if (document.formulario.tipo_logradouro.value == ""){
			 alert("Selecione o tipo de Logradouro!");
			 document.formulario.tipo_logradouro.focus();
			 return false;
	}	

	 if (document.formulario.logradouro.value == ""){
			 alert("Preencha o campo Nome do Logradouro!");
			 document.formulario.logradouro.focus();
			 return false;

	}
	 if (document.formulario.num_imovel.value == ""){
		 alert("Preencha o campo Número do imóvel!");
		 document.formulario.num_imovel.focus();
		 return false;

	}
	 if (document.formulario.bairro.value == ""){
		 alert("Preencha o campo Bairro!");
		 document.formulario.bairro.focus();
		 return false;

	}
	 if (document.formulario.cidade.value == ""){
		 alert("Preencha o campo Cidade!");
		 document.formulario.cidade.focus();
		 return false;

	}
	 if (document.formulario.uf.value == ""){
		 alert("Selecione o Estado!");
		 document.formulario.uf.focus();
		 return false;

	}

	 if (document.formulario.email.value == ""){
	     alert ("O E-MAIL deve ser preenchido.");
		  document.formulario.email.focus();
		  return false;
	 }
	 if (document.formulario.email.value != ""){
		if (! verificaEmail(document.formulario.email.value))
		{
		   alert ("O E-MAIL fornecido não é válido.");
			 document.formulario.email.focus();
		   return false;
		}
	 }
	 
		if (document.formulario.tel1_ddd.value == ""){
			 alert("O DDD deve ser preenchido!");
			 document.formulario.tel1_ddd.focus();
			 return false;
		}

		if (document.formulario.tel1_num.value == ""){
			 alert("Preencha o campo Telefone!");
			 document.formulario.tel1_num.focus();
			 return false;
		}
		
		//////////////////////////////////////  SISSOL 00013837/2014  //////////////////////////////////////
			
		if ((document.formulario.tel1_num.value.length != 9) &&
		(document.formulario.tel1_num.value.length != 10))
		{
			alert ("O Telefone fornecido deve conter 8 ou 9 números.");
			document.formulario.tel1_num.focus();
			return false;
		}
				
	
		
		if ((document.formulario.tel2_ddd.value != "" ) && (document.formulario.tel2_num.value == ""))		
		{
			alert ("O Número do Telefone deve ser preenchido.");
			document.formulario.tel2_num.focus();
			return false;
		}
		
		
		
		
		if (document.formulario.tel2_num.value != "")
		{
			if ((document.formulario.tel2_num.value.length != 9) &&
			(document.formulario.tel2_num.value.length != 10))
			{
				alert ("O Telefone fornecido deve conter 8 ou 9 números.");
				document.formulario.tel2_num.focus();
				return false;
			}
			if (document.formulario.tel2_ddd.value == "")
			{
				alert ("O DDD deve ser preenchido.");
				document.formulario.tel2_ddd.focus();
				return false;
			}
		}
		//////////////////////////////////////////////////////////////////////////////////////////////
	
	

	 if (document.formulario.cnae1.value == "")
	 { 
	  alert ("O CNAE (Classificação Nacional de Atividades Econômicas) deve ser preenchido.");		 
	  document.formulario.cnae1.focus();
	  return false;    
	 }

	 if (document.formulario.cnae1_dt_inicio.value == "")
	 { 
	  alert ("A Data de Início da CNAE deve ser preenchida. ");
	  document.formulario.cnae1_dt_inicio.focus();
	  return false;    
	 }
	 
	 if ((document.formulario.cnae2_dt_inicio.value != "") && (document.formulario.cnae2.value == ""))
	 { 
	  alert ("O CNAE (Classificação Nacional de Atividades Econômicas) deve ser preenchido. ");
	  document.formulario.cnae2.focus();
	  return false;    
	 }	 

	 
    if (trim2(document.formulario.atividades.value) == "")
	{ 
	  alert ("A Descrição da Atividade deve ser preenchida. ");
	  document.formulario.atividades.focus();
	  return false;
	}
	 
	if (!document.formulario.tipo_contabil[0].checked){ 
	  if(!document.formulario.tipo_contabil[1].checked){
		alert("Selecione o tipo de contabilidade.");
		document.formulario.tipo_contabil[0].focus();
		return false;
		}
	}

	 var formulario;
	 formulario = document.getElementsByTagName("input");
	 campos = new Array ('nome','cpf','cep','endereco','numero','bairro','municipio', 'uf', 'telefone','email');
	 var NameForm = document.formulario;
	 var nulo = false;

	 var contador = 0;
	 var contador_soc_ativos = 0;
		 //window.alert(contador);
		 //window.alert('testando');

	for(var i=0;i <= formulario.length -1;i++){
		 	if(typeof(formulario[i] == "object")){
				if((formulario[i].getAttribute('type') == 'radio')&&(formulario[i].id=='operacao')&&
				(formulario[i].checked== true)){		//valida todos os campos exceto "operacao de exclusão"					
			    	prefixo = formulario[i].name.substring(0,formulario[i].name.length - 9);
					var considerar_socio = true;
				    for( var w = 0; w < campos.length ; w++){
						    var campo = NameForm.elements[prefixo+"_"+campos[w]];     
						    var frase = campo.value;
						    if((frase.length) == 0 && (considerar_socio)){	
                                var possui_campo_preenchido = false;							
								for( var x = 0; x < campos.length ; x++){//verifica se nenhum campo deste socio está preenchido
										var campo_x = NameForm.elements[prefixo+"_"+campos[x]];     
										var valor = campo_x.value;	
										if (valor.length > 0){
											possui_campo_preenchido = true;
											break;
										}									
								}
                                if (!possui_campo_preenchido){
								  considerar_socio = false;	
								}	
                                if(considerar_socio){								
									window.alert('Favor preencher o campo '+campos[w]+' do sócio 0'+prefixo.substring(1,prefixo.length));
									campo.focus();
									nulo = true
									return false;
									break;
								}
						    }
							if(considerar_socio){
								if (campos[w] == 'email'){
									if (! verificaEmail(frase))
									{
										window.alert('O '+campos[w]+' do sócio 0'+prefixo.substring(1,prefixo.length)+' não é válido');
										campo.focus();
										return false;
										break;
									}
								}
								if(campos[w] == 'cpf'){
									if(verificaCpfCnpj(campo))
									{
										 campo.focus();
										 return false;
										 break;
									}
							    }
					        }
					}
					if(considerar_socio){
					  contador = contador + 1;
					  if(formulario[i].value != 3){
						  contador_soc_ativos = contador_soc_ativos + 1;
					  }
					}
				}       
			}
		}
		if(contador == '0'){
			window.alert('Necessário cadastro de pelo menos um sócio');
			document.formulario.c1_operacao[0].focus();
			return false;
		}
		if ((document.getElementById('natureza1').checked  == true) ||(document.getElementById('natureza2').checked  == true) || (document.getElementById('natureza3').checked  == true)){
			var soma_nm_ns = 0;
			if(document.formulario.qtde_ensino_medio.value != ""){
			  soma_nm_ns = parseInt(document.formulario.qtde_ensino_medio.value);
			}
			if(document.formulario.qtde_ensino_superior.value != ""){
			  soma_nm_ns = soma_nm_ns + parseInt(document.formulario.qtde_ensino_superior.value);	
			}
			if((soma_nm_ns > 0) && (soma_nm_ns < contador_soc_ativos)){
			  window.alert('A soma dos campos "Nível Fundamental/Médio" e "Nível Superior" do Item 9 do formulário, deve ser igual ou superior ao número de sócios preenchidos no formulário');
		      document.formulario.qtde_ensino_medio.focus();
			  return false;
		    }
		}		
	
    //INICIO - verifica campos CNAE

    var formulario;
	 formulario = document.getElementsByTagName("input");
	 campos = new Array ('cnae','dt_inicio');	 
	 var NameForm = document.formulario;

		 //window.alert(contador);
		 //window.alert('testando');
    
	var seq_cnae_anterior = '0';
	var seq_cnae = '0';
	for(var i=0;i <= formulario.length -1;i++){
		if(typeof(formulario[i] == "object")){
			if((formulario[i].getAttribute('type') == 'text')&&(formulario[i].id=='cnae')){		//valida todos os campos
				var seq_cnae = formulario[i].name.substring(4,formulario[i].name.length);
				var considerar_linha = true;
				//window.alert("cnae"+seq_cnae);
				for( var w = 0; w < campos.length ; w++){
					var campo = "";
					if (w == 0){
						campo = NameForm.elements["cnae"+seq_cnae]; //exemplo cnae1; cnae12
                    }else{
						//window.alert("cnae"+seq_cnae+"_"+campos[w]);
						campo = NameForm.elements["cnae"+seq_cnae+"_"+campos[w]];// exemplo: cnae1_dt_inicio; cnae13_dt_fim 
					}					
					var frase = campo.value;
					if((frase.length) == 0){	
                        if(w == 0){
							considerar_linha = false;
						}	
                        if(considerar_linha){						
							window.alert('Favor preencher o campo '+campos[w]+' do cnae na sequencia 0'+seq_cnae);
							campo.focus();
							return false;
							break;
						}	
					}
					if(w == campos.length-1 && considerar_linha && seq_cnae > 1){//cnae valido e não obrigatorio (CNAE secundário)
						campo = NameForm.elements["cnae"+(seq_cnae_anterior)]; 
						if(campo.value == 0){//verifica se o cnae anterior foi preenchido 
						  	window.alert('Favor preencher o campo CNAE na sequencia 0'+(seq_cnae_anterior));
							campo.focus();
							return false;
							break;	
						}
					}
				}
				seq_cnae_anterior = seq_cnae;
			}       
		}
	}
    //FIM CAMPOS CNAE		

	if (document.formulario.tipo_contabil[1].checked == true){
		// ABRIL 2014
	    if (document.formulario.contador_cpf.value == ""){
	        alert ("O CPF/CNPJ do contador deve ser preenchido.");
		     document.formulario.contador_cpf.focus();
		     return false;
	       }
	    if (document.formulario.contador_cpf.value != ""){
	       if (verificaCpfCnpj(document.formulario.contador_cpf)){
	          document.formulario.contador_cpf.focus();
	          return false;
	       }
	    }

	    if(document.formulario.cnpj.value == document.formulario.contador_cpf.value){
	    	alert("ATENÇÃO! \n O CNPJ digitado é o mesmo da Empresa. \n Favor informar o CPF/CNPJ do contador.");
			document.formulario.contador_cpf.focus();
	        return false;
	    }

	    if (document.formulario.contador_crc.value == ""){
	   		alert ("O CRC deve ser preenchido.");
	 	  	document.formulario.contador_crc.focus();
		  	return false;
			
		}
		
	    
	    if (document.formulario.contador_nome.value == ""){
	   		alert ("O NOME deve ser preenchido.");
	 	  	document.formulario.contador_nome.focus();
		  	return false;
		}
		 if (document.formulario.contador_cep.value == ""){
	   	 	alert("O CEP deve ser preenchido.");
	   	 	document.formulario.contador_cep.focus();
	   	 	return false;
	    }
	    if (document.formulario.contador_logradouro.value == ""){
	      	 alert("O NOME DO LOGRADOURO deve ser preenchido.");
	      	 document.formulario.contador_logradouro.focus();
	      	 return false;
	    }
	   	    if (document.formulario.contador_numero.value == ""){
	     	 alert("O NÚMERO DO IMÓVEL deve ser preenchido.");
	     	 document.formulario.contador_numero.focus();
	     	 return false;
	      }

	   	 if (document.formulario.contador_bairro.value == ""){
	     	 alert("O BAIRRO deve ser preenchido.");
	     	 document.formulario.contador_bairro.focus();
	     	 return false;
	      }

	   	 if (document.formulario.contador_cidade.value == ""){
	    	 alert("A CIDADE deve ser preenchida.");
	    	 document.formulario.contador_cidade.focus();
	    	 return false;
	     }
	    if (document.formulario.contador_email.value == ""){
		      alert ("O E-MAIL deve ser preenchido.");
		 	  document.formulario.contador_email.focus();
			  return false;
		}
		  if (document.formulario.contador_email.value != ""){
		   if (! verificaEmail(document.formulario.contador_email.value)){
			  alert ("O E-MAIL fornecido não é válido.");
		 	  document.formulario.contador_email.focus();
		 	  return false;
		    }
		  }

		if (((document.formulario.contador_tel1_ddd.value == "") &&
	      (document.formulario.contador_tel1_num.value == "")) &&
	     ((document.formulario.contador_tel2_ddd.value == "") &&
	      (document.formulario.contador_tel2_num.value == "")))
		{
		   alert ("O DDD deve ser preenchido.");
	 		 document.formulario.contador_tel1_ddd.focus();
		   return false;
	  }
	 if ((document.formulario.contador_tel1_ddd.value != "") &&
	     (document.formulario.contador_tel1_num.value == ""))
		{
		   alert ("O Número do Telefone deve ser preenchido.");
	 		 document.formulario.contador_tel1_num.focus();
		   return false;
	  }
	 if (document.formulario.contador_tel1_num.value != "")
	  {
	   if ((document.formulario.contador_tel1_num.value.length != 9) &&
	     (document.formulario.contador_tel1_num.value.length != 10))
			{
		   alert ("O Telefone fornecido deve conter 8 ou 9 números.");
	 		 document.formulario.contador_tel1_num.focus();
		   return false;
			}
	   if (document.formulario.contador_tel1_ddd.value == "")
			{
		   alert ("O DDD deve ser preenchido.");
	 		 document.formulario.contador_tel1_ddd.focus();
		   return false;
			}
	  }
	 if ((document.formulario.contador_tel2_ddd.value != "") &&
	     (document.formulario.contador_tel2_num.value == ""))
		{
		   alert ("O Número do Telefone deve ser preenchido.");
	 		 document.formulario.contador_tel2_num.focus();
		   return false;
	  }

	 if (document.formulario.contador_tel2_num.value != "")
	  {
		   if ((document.formulario.contador_tel2_num.value.length != 9) &&
		     (document.formulario.contador_tel2_num.value.length != 10))
				{
			   alert ("O Telefone fornecido deve conter 8 ou 9 números.");
		 		 document.formulario.contador_tel2_num.focus();
			   return false;
				}
		   if (document.formulario.contador_tel2_ddd.value == "")
				{
			   alert ("O DDD deve ser preenchido.");
		 		 document.formulario.contador_tel2_ddd.focus();
			   return false;
				}
	  }
	}
	else{
		if (document.formulario.tipo_contabil[0].checked == true){
			if(document.formulario.cnpj.value == document.formulario.contador_cpf.value){
				if(!(confirm("Foi informado o mesmo CNPJ \n para Empresa e Contador. \n Confirma? "))){
					document.formulario.contador_cpf.focus();	
					return false; 
				}
		    }
		}
	}

	
	// ABRIL/2014
	if (document.formulario.atividades.value == "")
	{ 
	 alert ("A Descrição da Atividade deve ser preenchida. ");
	 document.formulario.atividades.focus();
	 return false;
	}


	if (document.formulario.nome_requerente.value == "")
	{ 
	   	alert ("O Nome do Requerente deve ser preenchido. ");
	  	document.formulario.nome_requerente.focus();
	  	return false;
	}
    
	
	//buscaCNAES('6920-6/01-01');
	if (!verificaRepetidos()){
		return false;link
    }	
	
	verificaCNAES(); 
	var teste = g_cnae.localeCompare("sucesso") ;
	if (teste != 0){
		if (g_cnae.localeCompare("erro_conexao") == 0){
		  alert('Erro ao consultar CNAEs válidos. Tente mais tarde.');
		}
		return false;
	}

	var retorno = verificaCnaePrincipal();
    if (!retorno){
		 alert('Selecione a CNAE Principal.');
		return false;
	}
	
	var retorno = verificaCnaePrincipalEncerrado();
	if (!retorno){
		alert('Selecione uma CNAE Principal válida e que não possua data fim.');
		return false;
	}
	
	var retorno = validaDataCnae();
	if (!retorno){
		alert('A data fim do CNAE não deve ser maior que a data início.');
		return false;
	}
	/*
	if (document.formulario.tipo_contabil.value == "2")
	{ 
	 	alert (" Os campos abaixo devem ser preenchido.");		 
	 	document.formulario.tipo_contabil.focus();
	 	return false;    
	}
	*/
	// FIM ABRIL/2014
	
	///////////////////////////////FOR/////////////////////////////////
	
	
	
				if(!nulo){
				if(confirm("As informações dos campos Inscrição Municipal e CNPJ não são passíveis de edição. Em caso de alteração, preencher um novo formulário.\n\nTodas as informações do formulário foram verificadas?")){
				  habilitaCamposParaSalvar();
                  setPosCnaePrincipal();				  
				  return true;
				}else{
				  return false; 	
				}
				
			}
				
}//fecha Confirma



	 function validacnae(campo){
		if (campo.value != ""){
			if(campo.value != '4120-4/00-09'){//valida se o cnae informado é de obra. se for cnae de obra da mensagem e nao permite cadastrar.
				if (campo.value.length < 12){
					  alert ("Informe o CNAE Completo");
					  document.formulario.elements[campo.name].focus();
					  return false;
				}else{
					//alert(campo.name+"_dt_inicio");
					if ($("input[name=alteracao_data_topo]").val() != ""){ 
					  if($("input[name="+campo.name+"_dt_inicio"+"]").val() == ""){
						$("input[name="+campo.name+"_dt_inicio"+"]").val($("input[name=alteracao_data_topo]").val());
					  }
					  if (document.getElementById('natureza3').checked  == true){				  
						$("input[name="+campo.name+"_dt_fim"+"]").val($("input[name=alteracao_data_topo]").val());
						$("input[name=encerramento"+campo.name.substr(4,campo.name.length)+"]").prop("checked", true);
					  }	
					}else{
						$("input[name="+campo.name+"]").val("");
						alert("Preencha primeiro o campo data de alteração, no topo do formulário");
						
					}  
				}
			}else{
					alert("A CNAE informada é de obra, utilize o formulário de DIC específico para obras.");
					$("input[name="+campo.name+"]").val("");
					return false;
			}
			
		}else{//limpa campo dt_inicio do cnae
			 $("input[name="+campo.name+"_dt_inicio"+"]").val("");
			 $("input[name="+campo.name+"_dt_fim"+"]").val("");
			 //alert(campo.name.substr(4,campo.name.length));
			 $("input[name=encerramento"+campo.name.substr(4,campo.name.length)+"]").prop("checked", false);
		}
	}


		
	function trim2(str) {
	  return str.replace(/^\s+|\s+$/g,"");
   	}


	function mostra(id){
		var elemento=document.getElementById(id);
		elemento.style.display="block";		
	}

	function oculta(id){
		var elemento=document.getElementById(id);
		elemento.style.display="none";
	}	

	$(document).ready(function() {  
		$('#natureza1').change(function(){
					$('#encerramentoItem11').html("");
					$('#encerramentoItem13').html("");
				});
		$('#natureza2').change(function(){
					$('#encerramentoItem11').html("");
					$('#encerramentoItem13').html("");
				});
		$('#natureza3').change(function(){
					$('#encerramentoItem11').html("<br /> <u>ATENÇÃO:</u> Nos termos do artigo 65 do Decreto Municipal nº 15.356/2005, o encerramento de inscrição mobiliária do sujeito passivo não implica reconhecimento de sua regularidade fiscal e não obsta a apuração de eventuais créditos tributários.");	
					$('#encerramentoItem13').html("Encerramento de inscrição mobiliária efetivado atendendo aos artigos 64 e 65 do Decreto Municipal nº 15.356/2005. <br /><br />");
			});
		$("#emailP").focus(function(){
				$("#panelEmail").slideDown("slow");
			});	
		$("#emailP").blur(function(){
				$("#panelEmail").slideUp("slow");
			});	
		$("#complementoP").focus(function(){
				//$("#panelComplemento").slideDown("slow");
                //$("#panelComplemento").css("display", "block");
			});	
		$("#complementoP").blur(function(){
				//$("#panelComplemento").slideUp("slow");
				//$("#panelComplemento").css("display", "none");
			});		
		$('#panelComplemento').click(function() {
		  carregaCartografico($("input[type=radio][name='complemento_radio']:checked").val());
		    });	
        $('#panelComplemento').click(function(){ 
           $('html, body').animate({scrollTop:0}, 'slow');
        return false;

         });
		$("form").bind("keypress", function (e) {
		if (e.keyCode == 13) {
		return false;
		}
		});	 	 
		
	});
			










/* ****************************************************************************
   VERIFICACAO
 *****************************************************************************/

var isNS4 = (navigator.appName=="Netscape")?1:0;

// Verifica se o CPF � v�lido (retorna true se possuir erro)
   function verificaCpf(cpf) { 
      strcpf = cpf.value;
      str_aux = "";
      for( i = 0; i <= strcpf.length - 1; i++)
      if( (strcpf.charAt(i)).match(/\d/) ){
         str_aux += strcpf.charAt(i);
      } else if (!(strcpf.charAt(i)).match(/[\.\-]/)) {
         alert ("O n�mero do CPF cont�m caracteres inv�lidos. \n Por favor, confira.");
         cpf.focus();
         return true;
      }
      if (str_aux.length != 11) {
         alert ("O n�mero do CPF deve conter 11 d�gitos. \n Por favor, confira.");
         cpf.focus();
         return true;
      }
      soma1 = soma2 = 0;
      for (i = 0; i <= 8; i++) {
         soma1 += str_aux.charAt(i) * (10-i);
         soma2 += str_aux.charAt(i) * (11-i);
      }
      d1 = ((soma1 * 10) % 11) % 10;
      d2 = (((soma2 + (d1 * 2)) * 10) % 11) % 10;
      if ((d1 != str_aux.charAt(9)) || (d2 != str_aux.charAt(10)) || (verificaSeqCpf(strcpf)) ) {
    	  
         alert ("O n�mero de CPF digitado n�o � v�lido. \n Por favor, corrija!");
         cpf.focus();
         return true;
      }
     cpf.value = str_aux.substring(0,3)+"." +
                 str_aux.substring(3,6)+"." +
                 str_aux.substring(6,9)+"-" +
                 str_aux.substring(9,11);			
		 return false;	
   }
   
   
//Verifica sequ�ncia de d�gitos id�nticas - Fl�vio 16/04/2014

   function verificaSeqCpf(cpf) {
	   if(cpf == '000.000.000-00' || cpf == '111.111.111-11' || cpf == '222.222.222-22' || cpf == '333.333.333-33' || cpf == '444.444.444-44'
		   || cpf == '555.555.555-55' || cpf == '666.666.666-66' || cpf == '777.777.777-77' || cpf == '888.888.888-88' || cpf == '999.999.999-99'){
		   return true;
	   }
	   else{
		   return false;
	   }
   } 

// Verifica se o CNPJ � v�lido (retorna true se possuir erro)	 
function verificaCnpj(campo) {
   var cnpj    = campo.value;
   var erro    = true;
   var marcas  = ".-/";
   var numeros = "";
   var n       = 0;
   var d1      = 0;
   var d4      = 0;
   var xx      = 0;
   var digito,aux,fator,resto,digito1,digito2,soma,fim;
   if (cnpj.indexOf(" ")==-1) {
      for (i=0; i<cnpj.length; i++) {
         digito = cnpj.charAt(i);
         if (!isNaN(digito))
            numeros += digito;
         else
         if (marcas.indexOf(digito)!=-1 &&
            ((n==0 && (i==2  || i==5 || i==8 || i==12)) ||
             (n==1 && (i==6  || i==9 || i==13)) ||
             (n==2 && (i==10 || i==14)) ||
             (n==3 && i==15)))
            n++;
         else
            break;
      }
      if (numeros.length==14) {
         for (i=0; i<numeros.length-2; i++) {
            aux   = numeros.substring(i,i+1);
            fator = (xx<4)?5-xx:13-xx;
            d1    = d1+aux*fator;
            fator = (xx<5)?6-xx:14-xx;
            d4   += aux*fator;
            xx++;
         }
         resto   = (d1%11);
         digito1 = (resto<2)?0:11-resto;
         d4      = d4+2*digito1;
         resto   = (d4%11);
         digito2 = (resto<2)?0:11-resto;
         soma    = new String(digito1) + new String(digito2);
         fim     = numeros.substring(numeros.length-2,numeros.length);
         if (fim == soma) {
            campo.value = numeros.substring(0,2)+"."+
                          numeros.substring(2,5)+"."+
                          numeros.substring(5,8)+"/"+
                          numeros.substring(8,12)+"-"+
                          numeros.substring(12,14);
            erro = false;
         }
      }
   }
   //if (erro)
	   if (erro || cnpj == '00.000.000/0000-00'){		   
		 erro = true;
		 alert ("O n�mero de CNPJ digitado n�o � v�lido. \n Por favor, corrija!");
		}
  return erro;
  
}

// Verifica se o campo � CPF ou CNPJ e se � v�lido (retorna true se possuir erro)
function verificaCpfCnpj(campo) 
 {
   var documento = campo.value;
   var numeros = "";
   var digito;
   for (i=0; i<documento.length; i++) 
 	  {
     digito = documento.charAt(i);
     if (!isNaN(digito))
       numeros += digito;
		}			
   if (numeros.length==14) 
		{
		 return verificaCnpj(campo);
    }
   else if (numeros.length==11) 
		{
		 return verificaCpf(campo);
    }
	 else	
	  {
		alert ("O n�mero de CPF ou CNPJ digitado n�o � v�lido. \n Por favor, corrija!");
	    return true;
	  }	
}

// Verifica se a Data � v�lida (retorna true se possuir erro)
function verificaData(campo) 
 {
  var data = campo.value;
  var erro = false;
  var dia, mes, ano;
  if (data.indexOf(" ")+data.indexOf(".")+data.indexOf("-")+data.indexOf("+")==-4) 
	 {
    dia = data.substring(0,2);
    if (dia.charAt(1)=="/") 
		 {
      data = "0" + data;
      dia  = dia.charAt(0);
     }
    if (!isNaN(dia) && dia>=1 && dia<=31)
      if (data.charAt(2)=="/") 
			 {
        mes = data.substring(3,5);
        if (mes.charAt(1)=="/") 
				 {
          data = data.substring(0,3) + "0" + data.substring(3,data.length);
          mes  = mes.charAt(0);
          erro = true;
         }
        if (!isNaN(mes) && mes>=1 && mes<=12)
          if (data.charAt(5)=="/") 
					 {
            ano = data.substring(6,data.length);
            if (!isNaN(ano) && ano.length==4)
              erro = true;
           }
       }
   }
  if (!erro)
	 {
    alert ("A data digitada n�o � v�lida. \n Por favor, corrija!");
    campo.focus();
   } 
	else 
	 {
    ano = parseInt(ano,10);
    if (ano<4)
		 {
      ano += 2000;
     }
		else 
		 {
      if (ano<100)
			 {
        ano += 1900;
        if (dia > 30 && (mes==4 || mes==6 || mes==9 || mes==11)) 
				 {
          alert ("Este m�s n�o possui mais de 30 dias.");
          erro = true;
         }
       }
			else
			 {
        if (dia > 30 && (mes==4 || mes==6 || mes==9 || mes==11)) 
				 {
          alert ("Este m�s n�o possui mais de 30 dias.");
          erro = false;
         }
        if (mes==2) 
				 {
          if (dia>29) 
					 {
            alert ("Fevereiro n�o pode conter mais de 29 dias.");
            erro = false;
           }
					else
            if (dia==29 && ano%4!=0) 
						 {
              alert ("Este n�o � um ano bissexto.");
              erro = false;
             }
         }
        if (!erro) 
				 {
          campo.focus();
         }
				else 
				 {
          data = data.substr(0,6) + ano;
          campo.value = data;
         }
       }
     }
   }
  return erro;
 }


// Verifica se foi escolhido algum tipo de opera��o no quadro societario
function verificaOperacao(campo)
 {
  if (!((campo[1].checked) || (campo[2].checked) || (campo[3].checked) || (campo[0].checked)))
	 {
	  alert ("Voc� deve escolher o tipo de informa��o.");
		campo[0].focus();
		return false;
	 }
	return true; 
 }
 
function data1Maior(data1, data2)
 {
  if (data1.substring(6,10) > data2.substring(6,10))
    return true;
  else if (data1.substring(6,10) < data2.substring(6,10))
    return false;
  else if (data1.substring(3,5) > data2.substring(3,5))
    return true;
  else if (data1.substring(3,5) < data2.substring(3,5))
    return false;
  else if (data1.substring(0,2) > data2.substring(0,2))
    return true;
  else     
    return false;
 } 
// Verifica se a Inscri��o Municipal (Campinas) � v�lida
function verificaIM(im)
{
  var numeros = "";
  var digito, verificador, numero;	
  for (i=0; i<im.value.length; i++) 
	 {
    digito = im.value.charAt(i);
    if (!isNaN(digito))
      numeros += digito;
	 }				
  verificador = numeros.substring(numeros.length-1, numeros.length);
  numero = numeros.substring(0,numeros.length-1);
//  alert ("num:"+numero+"dig:"+verificador);

// funcao para gerar digito da im (fonte: Sistema SIM)
  var c, p, sw, wp, y;
  c = numero.length;
  if (c == 0)
   {
    return false;
   }    
  p = 2;
  sw = 0;
  while (c > 0)
  {
   w = parseInt(numero.substring(c-1,c));
   if (p > 8)
     p = 2;
   wp = w * p;
   sw = sw + wp;
   c = c-1;
   p = p+1;
  }
  if (sw < 11)
    y = sw;
  else
    y = sw % 11;
  if (y != 0)
   {
    if (y == 1)
      y = 0;
    else
      y = 11-y;
   }
  if (y == parseInt(verificador))
   {
    return true;
   } 
  else
   {  
    return false;
   }        
} 
 
function verificaEmail ( email ) 
 {
  if (email.search(
          /^[A-Za-z0-9._-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,6}$/)
             != -1)
    return true;
  else
    return false;
 }
 
/* ****************************************************************************
   FORMATACAO (MASCARAS)
 *****************************************************************************/

// Verifica se a tecla pressionada � numero ou teclas especiais 
function verificaNumero(tecla) 
 {
  if(!isNS4)
	 { 
    if ((tecla.keyCode < 48 || tecla.keyCode > 57) && (tecla.keyCode >= 32)) 
	   {
      tecla.returnValue = false;
      alert('Digite apenas n�meros.');
			return false;
     }
	 }	 
	else
	 {
    if ((tecla.which < 48 || tecla.which > 57) && (tecla.which >= 32)) 
	   {
      alert('Digite apenas n�meros.');
			return false;
     }	 
	 }
	return true; 	 
 }

// Verifica se a tecla pressionada � numero ou teclas especiais 
function verificaNroEndereco(tecla) 
 {
  if(!isNS4)
   { 
    if ((tecla.keyCode < 48 || tecla.keyCode > 57) && (tecla.keyCode >= 32)) 
     {
      tecla.returnValue = false;
      alert('Digite apenas n�meros. Caso o endere�o seja "Sem N�mero", digite "0".');
      return false;
     }
   }   
  else
   {
    if ((tecla.which < 48 || tecla.which > 57) && (tecla.which >= 32)) 
     {
      alert('Digite apenas n�meros. Caso o endere�o seja "Sem N�mero", digite "0".');
      return false;
     }   
   }
  return true;   
 }

// Verifica se a tecla pressionada � numero ou teclas especiais 
function verificaNumeroNaoZero(tecla) 
 {
  if(!isNS4)
	 { 
    if ((tecla.keyCode <= 48 || tecla.keyCode > 57) && (tecla.keyCode >= 32)) 
	   {
      tecla.returnValue = false;
      alert('Digite apenas n�meros maiores que zero.');
			return false;
       }
	 
	 }	 
	else
	 {
    if ((tecla.which <= 48 || tecla.which > 57) && (tecla.which >= 32)) 
	   {
      alert('Digite apenas n�meros maiores que zero.');
			return false;
       }
    }
	return true; 	 
 } 
 
// Verifica se a tecla pressionada � numero ou teclas especiais ou ,
function verificaDecimal(tecla) 
 {
  if(!isNS4)
	 {
    if ((tecla.keyCode < 48 || tecla.keyCode > 57) && (tecla.keyCode >= 32) && (tecla.keyCode != 44))
	   {
      tecla.returnValue = false;
      alert('Digite apenas n�meros ou [,] para decimal.');
			return false;
     }
	 }
	else
	 {
    if ((tecla.which < 48 || tecla.which > 57) && (tecla.which >= 32) && (tecla.which != 44))
	   {
      alert('Digite apenas n�meros ou [,] para decimal.');
			return false;
     }	 
	 }
	return true; 	 
 }

// Verifica se a tecla pressionada � codigo invalido 
function verificaCodigoInvalido(tecla, codigo) 
 {
  if(!isNS4)
	 { 
    if (tecla.keyCode == codigo.charCodeAt()) 
	   {
      tecla.returnValue = false;
      alert('Caracter "' + codigo.substring(0,1) + '" Inv�lido.');
			return false;
     }
	 }	 
	else
	 {
    if (tecla.which == codigo.charCodeAt()) 
	   {
      alert('Caracter "' + codigo.substring(0,1) + '" Inv�lido.');
			return false;
     }	 
	 }
	return true; 	 
 }
 
// Formata o campo data em DD/MM/AAAA 
function FormataData(Campo)
{
  var numeros = "";
	var tam;
	var digito;

  for (i=0; i<Campo.value.length; i++) 
 	 {
    digito = Campo.value.charAt(i);
    if (!isNaN(digito))
      numeros += digito;
	 }				
  tam = numeros.length;

  if (tam < 3) 
	 {
		 Campo.value = numeros;
	 }
  else if ((tam >= 3 ) && (tam < 5)) 
	 {
     Campo.value = numeros.substring(0,2) + '/' + numeros.substring(2,tam);
	 }
  else if ((tam >= 5) && (tam < 7))
	 {
     Campo.value = numeros.substring(0,2) + '/' + numeros.substring(2,4) + '/' + numeros.substring(4,tam);
   }
  else if (tam >= 7) 
	 {
     Campo.value = numeros.substring(0,2) + '/' + numeros.substring(2,4) + '/' + numeros.substring(4,8);
	 }
}

// Formata o codigo CODAE - X.XXX.XX.XXX
function FormataCodaeVelho(Campo)
 {
  var numeros = "";
	var tam;
	var digito;

  for (i=0; i<Campo.value.length; i++)
 	 {
    digito = Campo.value.charAt(i);
    if (!isNaN(digito))
      numeros += digito;
	 }
  tam = numeros.length;

  if (tam == 1)
	 {
		 Campo.value = numeros;
	 }
  else if ((tam > 1 ) && (tam <= 4))
	 {
     Campo.value = numeros.substring(0,1) + '.' + numeros.substring(1,tam);
	 }
  else if ((tam > 4) && (tam <= 6))
	 {
     Campo.value = numeros.substring(0,1) + '.' + numeros.substring(1,4) + '.' + numeros.substring(4,tam);
   }
  else if (tam > 6)
	 {
     Campo.value = numeros.substring(0,1) + '.' + numeros.substring(1,4) + '.' + numeros.substring(4,6) + '.' + numeros.substring(6,9);
	 }

}

// Formata o codigo CODAE - X.XXX.XX.XXX
function FormataCodae(Campo)
 {
  var numeros = "";
	var tam;
	var digito;

  for (i=0; i<Campo.value.length; i++)
 	 {
    digito = Campo.value.charAt(i);
    if (!isNaN(digito))
      numeros += digito;
	 }
  tam = numeros.length;

     if ((tam == 4))
	 {
     Campo.value = numeros;
	 }
     else if ((tam > 1) && (tam <= 4))
	 {
     Campo.value = numeros.substring(0,4) + '-' + numeros.substring(4,tam);
     }
     else if ((tam > 4) && (tam <= 5))
	 {
     Campo.value = numeros.substring(0,4) + '-' + numeros.substring(4,5) + '/' + numeros.substring(5,tam);
     }
     else if ((tam > 6))
	 {
     Campo.value = numeros.substring(0,4) + '-' + numeros.substring(4,5) + '/' + numeros.substring(5,7) + '-' + numeros.substring(7,9);
	 }
}

// Formata o codigo CODAE - X.XXX.XX.XXX
function FormataCBO(Campo)
 {
  var numeros = "";
	var tam;
	var digito;

  for (i=0; i<Campo.value.length; i++)
 	 {
    digito = Campo.value.charAt(i);
    if (!isNaN(digito))
      numeros += digito;
	 }
  tam = numeros.length;

      if ((tam == 4))
	 {
     Campo.value = numeros;
	 }
     else if ((tam > 5))
	 {
     Campo.value = numeros.substring(0,4) + '-' + numeros.substring(4,tam);
	 }
}



// Formata Inscri��o Estadual    110.042.490.114

function formataIE(Campo)
{
	  var numeros = "";
	  var digito, tam;
		 
	   for (i=0; i<Campo.value.length; i++) 
	 	  {
	     digito = Campo.value.charAt(i);
	     if (!isNaN(digito))
	       numeros += digito;
			}			
	   tam = numeros.length;

	   if (tam <= 3) 
		  {
	     Campo.value = numeros;
		  }
	   else if ((tam > 3) && (tam <= 6)) 
		  {
	     Campo.value = numeros.substring(0,3) + '.' + numeros.substring(3,tam);
		  }
	   else if ((tam > 6) && (tam <= 9)) 
		  {
	     Campo.value = numeros.substring(0,3) + '.' + numeros.substring(3,6) + '.' + numeros.substring(6,tam) ;
		  }
	   else if (tam > 9) 
		  {
	     Campo.value = numeros.substring(0,3) + '.' + numeros.substring(3,6) + '.' + numeros.substring(6,9) + '.' + numeros.substring(9,12);
		  }
}

// Formata a incricao municipal � direita - XX.XXX.XXX-X
function FormataIM_direita(Campo)
 {
  var numeros = "";
  var digito, tam;
	

  for (i=0; i<Campo.value.length; i++) 
	 {
    digito = Campo.value.charAt(i);
    if (!isNaN(digito))
      numeros += digito;
	 }				
  tam = numeros.length;

   if (tam == 1) 
	  {
     Campo.value = numeros;
	  }
   else if (tam == 2) 
	  {
     Campo.value = numeros.substring(0,1) + '-' + numeros.substring(1,2);
	  }
   else if (tam == 3) 
	  {
     Campo.value = numeros.substring(0,2) + '-' + numeros.substring(2,3);
	  }
   else if (tam == 4) 
	  {
     Campo.value = numeros.substring(0,3) + '-' + numeros.substring(3,4);
	  }
   else if (tam == 5) 
	  {
     Campo.value = numeros.substring(0,1) + '.' + numeros.substring(1,4) + '-' + numeros.substring(4,5);
	  }
   else if (tam == 6) 
	  {
     Campo.value = numeros.substring(0,2) + '.' + numeros.substring(2,5) + '-' + numeros.substring(5,6);
	  }
   else if (tam == 7) 
	  {
     Campo.value = numeros.substring(0,3) + '.' + numeros.substring(3,6) + '-' + numeros.substring(6,7);
	  }
   else if (tam == 8) 
	  {
     Campo.value = numeros.substring(0,1) + '.' + numeros.substring(1,4) + '.' + numeros.substring(4,7) + '-' + numeros.substring(7,8);
	  }
   else if (tam >= 9) 
	  {
     Campo.value = numeros.substring(0,2) + '.' + numeros.substring(2,5) + '.' + numeros.substring(5,8) + '-' + numeros.substring(8,9);
	  }
}

// Formata a incricao municipal - XX.XXX.XXX-X
function FormataIM(Campo)
 {
  var numeros = "";
  var digito, tam;
	
   for (i=0; i<Campo.value.length; i++) 
 	  {
     digito = Campo.value.charAt(i);
     if (!isNaN(digito))
       numeros += digito;
		}			
   tam = numeros.length;

   if (tam == 1) 
	  {
     Campo.value = numeros;
	  }
   else if (tam == 2) 
	  {
     Campo.value = numeros;
	  }
   else if (tam == 3) 
	  {
     Campo.value = numeros.substring(0,2) + '.' + numeros.substring(2,tam);
	  }
   else if (tam == 4) 
	  {
     Campo.value = numeros.substring(0,2) + '.' + numeros.substring(2,tam);
	  }
   else if (tam == 5) 
	  {
     Campo.value = numeros.substring(0,2) + '.' + numeros.substring(2,tam);
	  }
   else if (tam == 6) 
	  {
     Campo.value = numeros.substring(0,2) + '.' + numeros.substring(2,5) + '.' + numeros.substring(5,tam) ;
	  }
   else if (tam == 7) 
	  {
     Campo.value = numeros.substring(0,2) + '.' + numeros.substring(2,5) + '.' + numeros.substring(5,tam) ;
	  }
   else if (tam == 8) 
	  {
     Campo.value = numeros.substring(0,2) + '.' + numeros.substring(2,5) + '.' + numeros.substring(5,tam);
	  }
   else if (tam >= 9) 
	  {
     Campo.value = numeros.substring(0,2) + '.' + numeros.substring(2,5) + '.' + numeros.substring(5,8) + '-' + numeros.substring(8,9);
	  }
}

// Formata o CPF - XXX.XXX.XXX-XX
function FormataCpf(Campo)
 {
  var numeros = "";
  var digito, tam;
	 
   for (i=0; i<Campo.value.length; i++) 
 	  {
     digito = Campo.value.charAt(i);
     if (!isNaN(digito))
       numeros += digito;
		}			
   tam = numeros.length;

   if (tam <= 3) 
	  {
     Campo.value = numeros;
	  }
   else if ((tam > 3) && (tam <= 6)) 
	  {
     Campo.value = numeros.substring(0,3) + '.' + numeros.substring(3,tam);
	  }
   else if ((tam > 6) && (tam <= 9)) 
	  {
     Campo.value = numeros.substring(0,3) + '.' + numeros.substring(3,6) + '.' + numeros.substring(6,tam) ;
	  }
   else if (tam > 9) 
	  {
     Campo.value = numeros.substring(0,3) + '.' + numeros.substring(3,6) + '.' + numeros.substring(6,9) + '-' + numeros.substring(9,11);
	  }
}

// Formata o CNPJ - XX.XXX.XXX/XXXX-XX
function FormataCnpj(Campo)
 {
  var numeros = "";
  var digito, tam;
	 
   for (i=0; i<Campo.value.length; i++) 
 	  {
     digito = Campo.value.charAt(i);
     if (!isNaN(digito))
       numeros += digito;
		}			
   tam = numeros.length;

   if (tam <= 2) 
	  {
     Campo.value = numeros;
	  }
   else if ((tam > 2) && (tam <= 5)) 
	  {
     Campo.value = numeros.substring(0,2) + '.' + numeros.substring(2,tam);
	  }
   else if ((tam > 5) && (tam <= 8)) 
	  {
     Campo.value = numeros.substring(0,2) + '.' + numeros.substring(2,5) + '.' + numeros.substring(5,tam) ;
	  }
   else if ((tam > 8) && (tam <= 12)) 
	  {
     Campo.value = numeros.substring(0,2) + '.' + numeros.substring(2,5) + '.' + numeros.substring(5,8) + '/' + numeros.substring(8,tam);
	  }
   else if (tam > 12) 
	  {
     Campo.value = numeros.substring(0,2) + '.' + numeros.substring(2,5) + '.' + numeros.substring(5,8) + '/' + numeros.substring(8,12) + '-' + numeros.substring(12,14);
	  }		
}

// Formata o CEP - XX.XXX-XXX
function FormataCep(Campo)
 {
  var numeros = "";
  var digito, tam;
	
   for (i=0; i<Campo.value.length; i++) 
 	  {
     digito = Campo.value.charAt(i);
     if (!isNaN(digito))
       numeros += digito;
		}			
   tam = numeros.length;

   if (tam == 1) 
	  {
     Campo.value = numeros;
	  }
   else if (tam == 2) 
	  {
     Campo.value = numeros;
	  }
   else if (tam == 3) 
	  {
     Campo.value = numeros.substring(0,2) + '.' + numeros.substring(2,tam);
	  }
   else if (tam == 4) 
	  {
     Campo.value = numeros.substring(0,2) + '.' + numeros.substring(2,tam);
	  }
   else if (tam == 5) 
	  {
     Campo.value = numeros.substring(0,2) + '.' + numeros.substring(2,tam);
	  }
   else if (tam == 6) 
	  {
     Campo.value = numeros.substring(0,2) + '.' + numeros.substring(2,5) + '-' + numeros.substring(5,tam) ;
	  }
   else if (tam == 7) 
	  {
     Campo.value = numeros.substring(0,2) + '.' + numeros.substring(2,5) + '-' + numeros.substring(5,tam) ;
	  }
   else if (tam >= 8) 
	  {
     Campo.value = numeros.substring(0,2) + '.' + numeros.substring(2,5) + '-' + numeros.substring(5,8);
	  }		
}

// Formata o C�digo Cartogr�fico (IPTU) - XXXX.XX.XX.XXXX.XXXXX
function FormataCodCartografico(Campo) 
{
  var numeros = "";
  var digito, tam;
	 
   for (i=0; i<Campo.value.length; i++) 
 	  {
     digito = Campo.value.charAt(i);
     if (!isNaN(digito))
       numeros += digito;
		}			
   tam = numeros.length;

   if (tam <= 4) 
	  {
     Campo.value = numeros;
	  }
   else if ((tam > 4) && (tam <= 6)) 
	  {
     Campo.value = numeros.substring(0,4) + '.' + numeros.substring(4,tam);
	  }
   else if ((tam > 6) && (tam <= 8)) 
	  {
     Campo.value = numeros.substring(0,4) + '.' + numeros.substring(4,6) + '.' + numeros.substring(6,tam) ;
	  }
   else if ((tam > 8) && (tam <= 12)) 
	  {
     Campo.value = numeros.substring(0,4) + '.' + numeros.substring(4,6) + '.' + numeros.substring(6,8) + '.' + numeros.substring(8,tam);
	  }
   else if (tam > 12) 
	  {
     Campo.value = numeros.substring(0,4) + '.' + numeros.substring(4,6) + '.' + numeros.substring(6,8) + '.' + numeros.substring(8,12) + '.' + numeros.substring(12,17);
	  }		
}



function mtel(v){

    total = v.length;

    console.log(total);
    console.log(v.indexOf("("));
    console.log(v.indexOf(")"));

    if (total >= 10 && v.indexOf("(") == -1 && v.indexOf(")") == -1){

      primeiro = v.slice(0, 2);
      resto = v.slice(2,total);

      v = "("+primeiro+")"+resto; 
      total = 12;
    }

    if (total > 5 && v.search('-') == -1) {

      final = v.slice(total-4, total);
      resto = v.slice(0, total-4);

      return (resto+"-"+final);
    } else {
      return v;
    }
}


//Formata DDD/TELEFONE - 8 ou 9 d�gitos (XX)XXXXX-XXXX  (M�SCARA) 

function ddd_Tel( campo ) {
    
    function trata( valor,  isOnBlur ) {
        
       valor = valor.replace(/\D/g,"");                      
       valor = valor.replace(/^(\d{2})(\d)/g,"($1)$2");       
        
       if( isOnBlur ) {
           
          valor = valor.replace(/(\d)(\d{4})$/,"$1-$2");  
       } else {

          valor = valor.replace(/(\d)(\d{3})$/,"$1-$2");
       }
       return valor;
    }
     
    campo.onkeypress = function (evt) {
         
       var code = (window.event)? window.event.keyCode : evt.which;   
       var valor = this.value
        
       if(code > 57 || (code < 48 && code != 8 ))  {
          return false;
       } else {
          this.value = trata(valor, false);
       }
    }
     
    campo.onblur = function() {
        
       var valor = this.value;
       if( valor.length < 13 ) {
          this.value = ""
       }else {      
          this.value = trata( this.value, true );
       }
    }
     
    campo.maxLength = 14;
 }


// Formata telefone � direita - XXXX-XXXX
function FormataTelefone(Campo)
 {
  var numeros = "";
  var digito, tam;
  
  for (i=0; i<Campo.value.length; i++) 
	 {
    digito = Campo.value.charAt(i);
    if (!isNaN(digito))
      numeros += digito;
	 }				
  tam = numeros.length;

   if (tam <= 4) 
	  {
     Campo.value = numeros;
	  }
   else if (tam == 5) 
	  {
     Campo.value = numeros.substring(0,1) + '-' + numeros.substring(1,5);
	  }
   else if (tam == 6) 
	  {
     Campo.value = numeros.substring(0,2) + '-' + numeros.substring(2,6);
	  }
   else if (tam == 7) 
	  {
     Campo.value = numeros.substring(0,3) + '-' + numeros.substring(3,7);
	  }
   else if (tam == 8) 
	  {
	   Campo.value = numeros.substring(0,4) + '-' + numeros.substring(4,8);
	  }
   else 
	  {
     Campo.value = numeros.substring(0,5) + '-' + numeros.substring(5,9);
	  }
}

// Delimita o numero de caracteres / linha em uma area de texto
function textCounter(campo,maxLines,maxPerLine)
{
	var strTemp = "";
	var strLineCounter = 1;
	var strCharCounter = 0;
	
	for (var i = 0; i < campo.value.length; i++)
	{
		var strChar = campo.value.substring(i, i + 1);
		
		if (strChar == '\n')
		{
			strTemp += strChar;
			strLineCounter += 1;
			if (strLineCounter > maxLines)
			 campo.value = campo.value.substring(0, i-1)
			else			
  			strCharCounter = 1;
		}
		else if (strCharCounter == maxPerLine)
		{
			strTemp += '\n' + strChar;
			strLineCounter += 1;
			if (strLineCounter > maxLines)
			 campo.value = campo.value.substring(0, i)
			else			
  			strCharCounter = 1;
		}
		else
		{
			strTemp += strChar;
			strCharCounter ++;
		}
	}
}

function FormataValor(campo,tammax,teclapres) {

	var tecla = teclapres.keyCode;
	vr = document.formulario[campo].value;
	vr = vr.replace( "/", "" );
	vr = vr.replace( "/", "" );
	vr = vr.replace( ",", "" );
	vr = vr.replace( ".", "" );
	vr = vr.replace( ".", "" );
	vr = vr.replace( ".", "" );
	vr = vr.replace( ".", "" );
	tam = vr.length;
  //alert(tam);

/*	if (tam < tammax && tecla != 8){ tam = vr.length + 1 ; }

	if (tecla == 8 ){	tam = tam - 1 ; }    */

	if ( tecla == 8 || tecla >= 48 && tecla <= 57 || tecla >= 96 && tecla <= 105 ){
		if ( tam <= 2 ){
	 		document.formulario[campo].value = vr ; }
	 	if ( (tam > 2) && (tam <= 5) ){
	 		document.formulario[campo].value = vr.substr( 0, tam - 2 ) + ',' + vr.substr( tam - 2, tam ) ; }
	 	if ( (tam >= 6) && (tam <= 8) ){
	 		document.formulario[campo].value = vr.substr( 0, tam - 5 ) + '.' + vr.substr( tam - 5, 3 ) + ',' + vr.substr( tam - 2, tam ) ; }
	 	if ( (tam >= 9) && (tam <= 11) ){
	 		document.formulario[campo].value = vr.substr( 0, tam - 8 ) + '.' + vr.substr( tam - 8, 3 ) + '.' + vr.substr( tam - 5, 3 ) + ',' + vr.substr( tam - 2, tam ) ; }
	 	if ( (tam >= 12) && (tam <= 14) ){
	 		document.formulario[campo].value = vr.substr( 0, tam - 11 ) + '.' + vr.substr( tam - 11, 3 ) + '.' + vr.substr( tam - 8, 3 ) + '.' + vr.substr( tam - 5, 3 ) + ',' + vr.substr( tam - 2, tam ) ; }
	 	if ( (tam >= 15) && (tam <= 17) ){
	 		document.formulario[campo].value = vr.substr( 0, tam - 14 ) + '.' + vr.substr( tam - 14, 3 ) + '.' + vr.substr( tam - 11, 3 ) + '.' + vr.substr( tam - 8, 3 ) + '.' + vr.substr( tam - 5, 3 ) + ',' + vr.substr( tam - 2, tam ) ;}
	}
}

function FormataUfic(campo,tammax,teclapres) {

	var tecla = teclapres.keyCode;
	vr = document.formulario[campo].value;
	vr = vr.replace( "/", "" );
	vr = vr.replace( "/", "" );
	vr = vr.replace( ",", "" );
	vr = vr.replace( ".", "" );
	vr = vr.replace( ".", "" );
	vr = vr.replace( ".", "" );
	vr = vr.replace( ".", "" );
	tam = vr.length;

	if ( tecla == 8 || tecla >= 48 && tecla <= 57 || tecla >= 96 && tecla <= 105 ){
		if ( tam <= 4 ){
	 		document.formulario[campo].value = vr ; }
	 	if ( (tam > 4) && (tam <= 7) ){
	 		document.formulario[campo].value = vr.substr( 0, tam - 4 ) + ',' + vr.substr( tam - 4, tam ) ; }
	 	if ( (tam >= 8) && (tam <= 10) ){
	 		document.formulario[campo].value = vr.substr( 0, tam - 7 ) + '.' + vr.substr( tam - 7, 3 ) + ',' + vr.substr( tam - 4, tam ) ; }
	 	if ( (tam >= 11) && (tam <= 13) ){
	 		document.formulario[campo].value = vr.substr( 0, tam - 10 ) + '.' + vr.substr( tam - 10, 3 ) + '.' + vr.substr( tam - 7, 3 ) + ',' + vr.substr( tam - 4, tam ) ; }
	 	if ( (tam >= 14) && (tam <= 16) ){
	 		document.formulario[campo].value = vr.substr( 0, tam - 13 ) + '.' + vr.substr( tam - 13, 3 ) + '.' + vr.substr( tam - 10, 3 ) + '.' + vr.substr( tam - 7, 3 ) + ',' + vr.substr( tam - 4, tam ) ; }
	 	if ( (tam >= 17) && (tam <= 19) ){
	 		document.formulario[campo].value = vr.substr( 0, tam - 16 ) + '.' + vr.substr( tam - 16, 3 ) + '.' + vr.substr( tam - 13, 3 ) + '.' + vr.substr( tam - 10, 3 ) + '.' + vr.substr( tam - 7, 3 ) + ',' + vr.substr( tam - 4, tam ) ;}
	}
}

function removeChar(str, char) {
  while (str.indexOf(char) != -1) {
    pre = str.slice(0, str.indexOf(char));
	pos = str.slice(str.indexOf(char) + 1);
	str = pre.concat(pos);
  }
  return str;
}

function formataCodCartografico(src, val) {

  val = removeChar(val, ".");
  val = val.slice(0,16);
  folha = val.slice(0,4);
  param = val.slice(4,6);
  quad = val.slice(6,8);
  lot = val.slice(8,12);
  bloco = val.slice(12,16);
  if (folha!="")
    src.value = folha;
  if (param!="")
    src.value = folha+"."+param;
  if (quad!="")
    src.value = folha+"."+param+"."+quad;
  if (lot!="")
    src.value = folha+"."+param+"."+quad+"."+lot;
  if (bloco!="")
    src.value = folha+"."+param+"."+quad+"."+lot+"."+bloco;

}

// Formata n�mero CCO � direita - XXXX/XXXX
function FormataCCO_direita(Campo)
 {
  var numeros = "";
  var digito, tam;
	
  for (i=0; i<Campo.value.length; i++) 
	 {
    digito = Campo.value.charAt(i);
    if (!isNaN(digito))
      numeros += digito;
	 }				
  tam = numeros.length;
//substring(start,end)
   if (tam == 4) 
	  {
     Campo.value = '/' + numeros.substring(0,4);
	  }
   else if (tam == 5) 
	  {
     Campo.value = numeros.substring(0,1) + '/' + numeros.substring(1,5);
	  }
   else if (tam == 6) 
	  {
     Campo.value = numeros.substring(0,2) + '/' + numeros.substring(2,6);
	  }
   else if (tam == 7) 
	  {
     Campo.value = numeros.substring(0,3) + '/' + numeros.substring(3,7);
	  }
   else if (tam == 8) 
	  {
     Campo.value = numeros.substring(0,4) + '/' + numeros.substring(4,8);
	  }
   else if (tam == 9) 
	  {
     Campo.value = numeros.substring(0,5) + '/' + numeros.substring(5,9);
	  }
}


// Formata n�mero CEI � direita - XX.XXX.XXXXX/XX
function FormataCEI_direita(Campo)
 {
  var numeros = "";
  var digito, tam;
	 
   for (i=0; i<Campo.value.length; i++) 
 	  {
     digito = Campo.value.charAt(i);
     if (!isNaN(digito))
       numeros += digito;
		}			
   tam = numeros.length;

   if (tam == 2) 
	  {
     Campo.value = numeros.substring(0,2);
	  }
   else if (tam == 3) 
	  {
     Campo.value = numeros.substring(0,1) + '/' + numeros.substring(1,3);
	  }
   else if (tam == 4) 
	  {
     Campo.value = numeros.substring(0,2) + '/' + numeros.substring(2,4);
	  }
   else if (tam == 5) 
	  {
     Campo.value = numeros.substring(0,3) + '/' + numeros.substring(3,5);
	  }
   else if (tam == 6) 
	  {
     Campo.value = numeros.substring(0,4) + '/' + numeros.substring(4,6);
	  }
   else if (tam == 7) 
	  {
     Campo.value = numeros.substring(0,5) + '/' + numeros.substring(5,7);
	  }
   else if (tam == 8) 
	  {
     Campo.value = numeros.substring(0,1) + '.' + numeros.substring(1,6) + '/' + numeros.substring(6,8);
	  }
   else if (tam == 9) 
	  {
     Campo.value = numeros.substring(0,2) + '.' + numeros.substring(2,7) + '/' + numeros.substring(7,9);
	  }	
   else if (tam == 10) 
	  {
     Campo.value = numeros.substring(0,3) + '.' + numeros.substring(3,8) + '/' + numeros.substring(8,10);
	  }	
   else if (tam == 11) 
	  {
     Campo.value = numeros.substring(0,1) + '.' + numeros.substring(1,4) + '.' + numeros.substring(4,9) + '/' + numeros.substring(9,11);
	  }	
   else if (tam == 12) 
	  {
     Campo.value = numeros.substring(0,2) + '.' + numeros.substring(2,5) + '.' + numeros.substring(5,10) + '/' + numeros.substring(10,12);
	  }	
}