  - 1️⃣ What is the difference between var, let, and const?


Answer:In javascript var, let, and const are all used to declare variables — but they behave differently in scope, reassignment, and hoisting.
var (Function Scoped): If declared inside a function, it is available anywhere within that function. If declared outside, it is global. It ignores block boundaries (like if statements or for loops).

let & const (Block Scoped): These are strictly bound to the block { } where they are defined. This prevents "leaking" variables into places they don't belong.


    - 2️⃣ What is the spread operator (...)?

    Answer: The spread operator (...) is a powerful syntax introduced in ES6 that allows an iterable (like an array or string) or an object to be expanded into individual elements or properties.
    The spread operator is most commonly used to combine, copy, or pass arrays as arguments.


    - 3️⃣ What is the difference between map(), filter(), and forEach()?

      Answer: map(), filter(), and forEach() are array methods in JavaScript used to loop through arrays, but they have different purposes and return values.

      map() transforms each element of an array and returns a new array with the modified values.
      example: const numbers = [1, 2, 3, 4];

               const doubled = numbers.map(num => num * 2);

               console.log(doubled);


     filter() creates a new array containing only the elements that match a condition.

     example:const numbers = [1, 2, 3, 4, 5];

      const even = numbers.filter(num => num % 2 === 0);

      console.log(even);   

      forEach() loops through an array but does not return a new array.       
       example: const numbers = [1, 2, 3];

numbers.forEach(num => {
  console.log(num * 2);
});



    - 4️⃣ What is an arrow function?

    Answer:an arrow function is a shorter way to write a function in JavaScript. It was introduced in ES6 (ECMAScript 2015) and uses the => arrow symbol.

   Example: const greet = () => {
    console.log("Hello");
    };

    greet();

    Output:

    Hello




    - 5️⃣ What are template literals?

    Answer:template literals are a feature in JavaScript (ES6) that allow you to create strings in an easier and more powerful way. They use backticks instead of single or double quotes.

    Template Literal
    const name = "John";
    const message = `Hello ${name}!`;

  Here, ${name} inserts the variable into the string.
