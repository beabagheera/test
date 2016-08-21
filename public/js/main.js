var arrayProducts ;
var arrayCustomers;
var json;

function load(callback) {

    //LOAD CUSTOMERS JSON
    var customers = new XMLHttpRequest();
    customers.overrideMimeType("application/json");
    customers.open('GET', '/data/customers.json', true);
    
    customers.onreadystatechange = function() {
        if (customers.readyState == 4 && customers.status == "200") {

             arrayCustomers = JSON.parse(customers.responseText);
            
            for(var i=0;i<arrayCustomers.length;i++)
            {
                var tr="<tr>";
                var td1="<td>"+arrayCustomers[i]["id"]+"</td>";
                var td2="<td>"+arrayCustomers[i]["name"]+"</td>";
                var td3="<td>"+arrayCustomers[i]["revenue"]+"</td>";
                var td4="<td>"+arrayCustomers[i]["since"]+"</td></tr>";
                $("#mytable").append(tr+td1+td2+td3+td4); 
            }
        }
    };
    customers.send(null);

    //LOAD PRODUCTS JSON
    var products = new XMLHttpRequest();
    products.overrideMimeType("application/json");
    products.open('GET', '/data/products.json', true);
    products.onreadystatechange = function() {
        if (products.readyState == 4 && products.status == "200") {

            arrayProducts = JSON.parse(products.responseText);
           
            for(var i=0;i<arrayProducts.length;i++)
            {
                var tr="<tr>";
                var td1="<td>"+arrayProducts[i]["id"]+"</td>";
                var td2="<td>"+arrayProducts[i]["description"]+"</td>";
                var td3="<td>"+arrayProducts[i]["category"]+"</td>";
                var td4="<td>"+arrayProducts[i]["price"]+"</td></tr>";
                $("#mytable2").append(tr+td1+td2+td3+td4); 

            }

        }
    };
    products.send(null);

};

function getCheapestProduct()
{
    var cheapest= parseFloat(arrayProducts[0]["price"]);
    var id;
    for(var i=1;i< arrayProducts.length; i++)
    {
        if(cheapest> parseFloat(arrayProducts[i]["price"]))
        {
            cheapest=arrayProducts[i]["price"];
            id=arrayProducts[i]["id"];
        }
    }
    return id;
}
function parseJson(inputJson)
{
// MAKE DISSCOUNTS FOR CUSTOMERS
    json=inputJson;
    var tr = "<ul><li> ID: "+json["id"]+"</li>";
    var td1 = "<li> CUSTOMER-ID: "+json["customer-id"]+"</li>";
    var aux ="";

    for(var i=0; i<json["items"].length; i++)
    {
      aux = aux+ "<li> ITEM " + (i+1) +"<ul>";
      aux= aux+"<li>Product-id: "+ json["items"][i]["product-id"]+"</li>";   
      aux= aux+"<li>Quantity: "+ json["items"][i]["quantity"]+"</li>";   
      aux= aux+"<li>unit-price: "+ json["items"][i]["unit-price"]+"</li>";
      aux= aux+"<li>Total: "+ json["items"][i]["total"]+"</li>";
      aux = aux+ "</ul></li>";
    }
    
    var td4 = "<li>TOTAL: "+json["total"]+"</li></ul><hr>";

    
    $("#div2").html(tr+td1+aux+td4); 

    $("#div2").append('<h1>RESUME</h1><hr>');

    if(json["total"]>=1000)
    {
        $("#div2").append("<h4>You get a discount of 10% on the whole quotation.</h4>")
    }
    
  
    for(var i=0; i<json["items"].length; i++)
    {
        if(json["items"][i]["quantity"]>=2)
        {
            for(var j =0 ; j<arrayProducts.length ;j++)
            {
                if(json["items"][i]["product-id"]== arrayProducts[j]["id"] && arrayProducts[j]["category"]==1)
                {
                     $("#div2").append("<h4> You get a 20% discount on the cheapest product.</h4>");
                     var cheapProduct= getCheapestProduct();
                     $("#div2").append("<h4>Product:"+cheapProduct+"</h4>");
                } 
                if(json["items"][i]["product-id"]== arrayProducts[j]["id"] && arrayProducts[j]["category"]==2)
                {
                    if(json["items"][i]["quantity"]==5)
                    {
                         $("#div2").append("<h4>You get the sixth product of category 2 for free</h4>")
                    }
                } 
                
            } 
             
        }

    }
$("#div2").append('<hr>');

 
updateCustomerTable();
}

function updateCustomerTable()
{
    var found=false;
    $("#mytable").html("");
    $("#mytable").append("<tr><th>id</th><th>Name</th><th>Revenue</th><th>Since</th></tr>");
    for(var i=0; i<arrayCustomers.length; i++)
    {
        if(arrayCustomers[i]["id"]== json["customer-id"])
        {
            arrayCustomers[i]["revenue"]= parseFloat(json["total"])+ parseFloat(arrayCustomers[i]["revenue"]);
            found=true;
        }
             var tr="<tr>";
            var td1="<td>"+arrayCustomers[i]["id"]+"</td>";
            var td2="<td>"+arrayCustomers[i]["name"]+"</td>";
            var td3="<td>"+arrayCustomers[i]["revenue"]+"</td>";
            var td4="<td>"+arrayCustomers[i]["since"]+"</td></tr>";   
        
        $("#mytable").append(tr+td1+td2+td3+td4); 

    }

   
}