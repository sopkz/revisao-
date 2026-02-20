import express from "express"
import { conexao } from "./db.js"

const app = express()
const PORTA = 5000

app.use(express.json())

app.get("/db", async (req, res) => {
    const [resultado] = await conexao.query("SELECT 1 AS OK")
    res.json(resultado)
})

app.get("/matriculas", async (req, res) => {
    const [resultado] = await conexao.query(`
        SELECT 
            alunos.NOME AS aluno,
            cursos.NOME_CURSO AS curso
        FROM matriculas
        INNER JOIN alunos 
            ON matriculas.ALUNO_ID = alunos.ID
        INNER JOIN cursos 
            ON matriculas.CURSO_ID = cursos.ID
        ORDER BY alunos.ID
    `)

    res.status(200).json(resultado)
})


app.get("/matriculas/:codigo", async (req, res) => {

    const id = Number(req.params.codigo)

    if (Number.isNaN(id)) {
        return res.status(400).json({ msg: "ID inválido" })
    }

    const [resultado] = await conexao.query(`
        SELECT 
            alunos.NOME AS aluno,
            cursos.NOME_CURSO AS curso
        FROM matriculas
        INNER JOIN alunos 
            ON matriculas.ALUNO_ID = alunos.ID
        INNER JOIN cursos 
            ON matriculas.CURSO_ID = cursos.ID
        WHERE alunos.ID = ?
    `, [id])

    if (resultado.length === 0) {
        return res.status(404).json({ msg: "Matrícula não encontrada" })
    }

    res.status(200).json(resultado)
})


app.get("/alunos", async (req, res) => {

    const nome = req.query.nome || ""

    const [resultado] = await conexao.query(
        `SELECT ID, NOME
         FROM ALUNOS
         WHERE NOME LIKE ?
         ORDER BY ID`,
        [`%${nome}%`]
    )

    res.status(200).json(resultado)
})


app.get("/alunos/:codigo", async (req, res) => {

    const id = Number(req.params.codigo)

    if (Number.isNaN(id)) {
        return res.status(400).json({ msg: "ID inválido" })
    }

    const [resultado] = await conexao.query(
        `SELECT ID, NOME FROM ALUNOS WHERE ID = ?`,
        [id]
    )

    if (resultado.length === 0) {
        return res.status(404).json({ msg: "Aluno não encontrado" })
    }

    res.status(200).json(resultado[0])
})


app.post("/alunos", async (req, res) => {

    const { nome } = req.body

    if (!nome || nome.trim() === "") {
        return res.status(400).json({ msg: "Informe o nome" })
    }

    const [resultado] = await conexao.query(
        `INSERT INTO ALUNOS (NOME) VALUES (?)`,
        [nome]
    )

    res.status(201).json({
        msg: "Aluno cadastrado",
        id: resultado.insertId
    })
})


app.put("/alunos/:codigo", async (req, res) => {

    const id = Number(req.params.codigo)
    const { nome } = req.body

    if (Number.isNaN(id)) {
        return res.status(400).json({ msg: "ID inválido" })
    }

    if (!nome || nome.trim() === "") {
        return res.status(400).json({ msg: "Informe o nome" })
    }

    const [resultado] = await conexao.query(
        `UPDATE ALUNOS SET NOME = ? WHERE ID = ?`,
        [nome, id]
    )

    if (resultado.affectedRows === 0) {
        return res.status(404).json({ msg: "Aluno não encontrado" })
    }

    res.status(200).json({ msg: "Aluno atualizado com sucesso" })
})


app.delete("/alunos/:codigo", async (req, res) => {

    const id = Number(req.params.codigo)

    if (Number.isNaN(id)) {
        return res.status(400).json({ msg: "ID inválido" })
    }

    const [resultado] = await conexao.query(
        `DELETE FROM ALUNOS WHERE ID = ?`,
        [id]
    )

    if (resultado.affectedRows === 0) {
        return res.status(404).json({ msg: "Aluno não encontrado" })
    }

    res.status(200).json({ msg: "Aluno removido com sucesso" })
})


app.get("/cursos", async (req, res) => {

    const [resultado] = await conexao.query(
        `SELECT ID, NOME_CURSO FROM CURSOS ORDER BY ID`
    )

    res.status(200).json(resultado)
})


app.get("/cursos/:codigo", async (req, res) => {

    const id = Number(req.params.codigo)

    if (Number.isNaN(id)) {
        return res.status(400).json({ msg: "ID inválido" })
    }

    const [resultado] = await conexao.query(
        `SELECT ID, NOME_CURSO FROM CURSOS WHERE ID = ?`,
        [id]
    )

    if (resultado.length === 0) {
        return res.status(404).json({ msg: "Curso não encontrado" })
    }

    res.status(200).json(resultado[0])
})


app.post("/cursos", async (req, res) => {

    const { nome } = req.body

    if (!nome || nome.trim() === "") {
        return res.status(400).json({ msg: "Informe o nome do curso" })
    }

    const [resultado] = await conexao.query(
        `INSERT INTO CURSOS (NOME_CURSO) VALUES (?)`,
        [nome]
    )

    res.status(201).json({
        msg: "Curso cadastrado",
        id: resultado.insertId
    })
})

app.put("/cursos/:codigo", async (req, res) => {

    const id = Number(req.params.codigo)
    const { nome } = req.body

    if (Number.isNaN(id)) {
        return res.status(400).json({ msg: "ID inválido" })
    }

    if (!nome || nome.trim() === "") {
        return res.status(400).json({ msg: "Informe o nome do curso" })
    }

    const [resultado] = await conexao.query(
        `UPDATE CURSOS SET NOME_CURSO = ? WHERE ID = ?`,
        [nome, id]
    )

    if (resultado.affectedRows === 0) {
        return res.status(404).json({ msg: "Curso não encontrado" })
    }

    res.status(200).json({ msg: "Curso atualizado com sucesso" })
})


app.delete("/cursos/:codigo", async (req, res) => {

    const id = Number(req.params.codigo)

    if (Number.isNaN(id)) {
        return res.status(400).json({ msg: "ID inválido" })
    }

    const [resultado] = await conexao.query(
        `DELETE FROM CURSOS WHERE ID = ?`,
        [id]
    )

    if (resultado.affectedRows === 0) {
        return res.status(404).json({ msg: "Curso não encontrado" })
    }

    res.status(200).json({ msg: "Curso removido com sucesso" })
})

app.delete("/matriculas/:codigo", async (req, res) => {

    const id = Number(req.params.codigo)

    if (Number.isNaN(id)) {
        return res.status(400).json({ msg: "ID inválido" })
    }

    const [resultado] = await conexao.query(
        `DELETE FROM MATRICULAS WHERE ID = ?`,
        [id]
    )

    if (resultado.affectedRows === 0) {
        return res.status(404).json({ msg: "Matrícula não encontrada" })
    }

    res.status(200).json({ msg: "Matrícula removida com sucesso" })
})



app.post("/matriculas", async (req, res) => {

    const { alunoId, nomeCurso } = req.body

    if (!alunoId || !nomeCurso) {
        return res.status(400).json({ msg: "Informe alunoId e nomeCurso" })
    }


    const [aluno] = await conexao.query(
        `SELECT ID FROM ALUNOS WHERE ID = ?`,
        [alunoId]
    )

    if (aluno.length === 0) {
        return res.status(404).json({ msg: "Aluno não encontrado" })
    }


    const [curso] = await conexao.query(
        `SELECT ID FROM CURSOS WHERE NOME_CURSO = ?`,
        [nomeCurso]
    )

    if (curso.length === 0) {
        return res.status(404).json({ msg: "Curso não encontrado" })
    }

    const cursoId = curso[0].ID

  
    await conexao.query(
        `INSERT INTO MATRICULAS (ALUNO_ID, CURSO_ID)
         VALUES (?, ?)`,
        [alunoId, cursoId]
    )

    res.status(201).json({ msg: "Matrícula realizada com sucesso" })
})



app.listen(PORTA, () => {
    console.log(`Servidor rodando em: http://localhost:${PORTA}`)
})