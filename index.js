const express = require("express");
const MercadoPago = require("mercadopago");
const app = express();

MercadoPago.configure({
    sandbox: true,
    access_token: "TEST-3162541190280452-072417-3054dede1b40288af0e62bedea395036-156525613"
});

app.get("/",(req,res) =>{
    res.send("API - Mercado Pago")
});

app.get("/pagar",async (req, res) =>{

    var id = ""+Date.now();
    var emailPagador="lerron@itriad.org.br";

    var dados = {
        items:[
            item={
                id: id,
                title: "Produto generico",
                quantity: 1,
                currency_id: 'BRL',
                unit_price: parseFloat(150)
            }
        ],
        payer:{
            email: emailPagador
        },
        external_reference: id
    }

    try{
        var pagamento = await MercadoPago.preferences.create(dados);
       // console.log(pagamento);
        return res.redirect(pagamento.body.init_point);
    }
    catch(err){
        return res.send(err.message);
    }
});

app.post("/not",(req,res) =>{
    var id = req.query.id;

    setTimeout(() => {
        
        var filtro = {
            "order.id": id
        }

        MercadoPago.payment.search({
            qs: filtro
        }).then( data => {
            var pagamento = data.body.results[0];

            if(pagamento != undefined){
                //console.log(pagamento);
                console.log(pagamento.external_reference);
                console.log(pagamento.status);
            }else{
                console.log("pagamento nao existe")
            }

        }).catch(err => {
            console.log(err);
        });

    }, 20000);

    res.send("OK");
});


app.listen(80,(req,res) => {
    console.log("Servidor Rodando!")
});