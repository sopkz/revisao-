import mysql from "mysql2/promise";

export const conexao = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "20112008",
    database:"escola",
    port: 3306,
    //Define se o pool deve esperar quando não houver conexão 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit:0
})