#!/usr/bin/env node
import { pinyin } from "pinyin-pro";

// Capturamos los argumentos que el usuario pasa en la terminal
const inputArgs = process.argv.slice(2);
// .slice(2) elimina los primeros dos elementos
// (la ruta de node y la ruta del archivo)
// y deja únicamente los argumentos escritos por el usuario.
const text = inputArgs.join(" ");
// Une todos los argumentos en un solo string separado por espacios.
// Resultado del ejemplo:
// "hola mundo"

// Validación básica
if (!text) {
  console.log("\n❌ Por favor, ingresa los caracteres chinos.");
  console.log("Uso: pinyin 你好\n");
  process.exit(1);
}

// Conversión
const result = pinyin(text);

// Salida formateada
console.log(`\n🇨🇳 Hanzi:  ${text}`);
console.log(`🔤 Pinyin: ${result}\n`);
