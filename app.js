let randomWord; // Resultado da Random Word API
let wordInfos; // Resultado da Dictionary API
let wordOfTheDay; // Objeto com as info da palavra

async function getRandomWord() {
    // Pedindo palavra aleatória pra Random Word API
    // Vai esperar a API trazer o resultado para continuar, porque demora
    const res = await fetch("https://random-word-api.herokuapp.com/word");

    // Transforma o resultado bruto da API em um JSON, para poder ser usado
    const data = await res.json();

    // Essa API devolve um array, usa o indice para pegar o valor e atribuir à uma variável
    randomWord = data[0];
}

async function getWordDictionaryInfos() {

    // Loop até achar uma palavra válida e com todas as informações
    while (true) {

        // Pesquisando a palavra na Dictionary API
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`)
        const data = await res.json();

        // Verifica se a API retornou um array (palavra existe)
        if (Array.isArray(data)) {
            
            // Simula a construção do objeto para checar se ele é completo
            const check = buildWordOfTheDay(data);

            // Verifica se alguma categoria ficou com o texto de erro (vazia)
            const isComplete = 
                check.partOfSpeech !== "sem classe gramatical" &&
                check.phonetic !== "sem fonética" &&
                check.meaning !== "sem significado" &&
                check.example !== "sem exemplo";

            if (isComplete) {
                wordInfos = data;
                break;
            } 
        }

        // Se palavra não válida ou não tem todas as categorias gera outra e tenta denovo
        await getRandomWord();
    }
}

function buildWordOfTheDay(wordInfos) {

    // Encurtando a escrita e deixando mais limpo
    const entry = wordInfos[0];

    // Pegando as informações de dentro do array resposta da Dictionary API
    // Caso os valores não existam ou sejam inconsistentes atribuí 
    // Construindo um objeto
    return {
        word: entry.word,
        partOfSpeech: entry.meanings?.[0]?.partOfSpeech || "sem classe gramatical",
        phonetic: entry.phonetic || entry.phonetics?.[0]?.text || "sem fonética",
        meaning: entry.meanings?.[0]?.definitions?.[0]?.definition || "sem significado",
        example: entry.meanings?.[0]?.definitions?.[0]?.example || "sem exemplo"
    };
}

async function start() {

    // garante a ordem do fluxo: só busca no dicionário depois de obter a palavra aleatória
    await getRandomWord();
    await getWordDictionaryInfos();
    wordOfTheDay = buildWordOfTheDay(wordInfos);
    console.log(wordOfTheDay)
}




start();
