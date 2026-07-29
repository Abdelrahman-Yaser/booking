// --- 1. استخراج الداتا (البطاقة الشخصية) ---
const person = { name: "Ali", age: 25, job: "Dev" };

console.log(Object.keys(person));   // ["name", "age", "job"]    | العناوين
console.log(Object.values(person)); // ["Ali", 25, "Dev"]        | المعلومات
console.log(Object.entries(person));// [["name","Ali"], ...]    | العنوان والمعلومة سوا



// --- 2. دمج الداتا (عمل ساندوتش) ---
const bread = { type: "White" };
const meat = { item: "Beef" };

const sandwich = Object.assign({}, bread, meat); 
console.log(sandwich); // { type: "White", item: "Beef" } | دمجناهم في كائن واحد


// --- 3. تحويل المصفوفة لكائن (تجميع المكعبات) ---
const pair = [['color', 'red'], ['size', 'L']];

const result = Object.fromEntries(pair);
console.log(result); // { color: "red", size: "L" } | رجعت لشكلها الطبيعي


// --- 4. الحماية (تجميد وقفل البيانات) ---
const car = { brand: "BMW" };

// التجميد (ممنوع أي تغيير)
Object.freeze(car);
car.brand = "Fiat"; // محاولة تغيير
console.log(car.brand); // "BMW" | القيمة لم تتغير

// القفل (تعديل مسموح، إضافة ومسح ممنوع)
const user = { role: "Admin" };
Object.seal(user);
user.role = "User";   // مسموح
user.id = 1;          // ممنوع (إضافة)
console.log(user);    // { role: "User" }


// --- 5. المقارنة الذكية ---
console.log(Object.is(NaN, NaN)); // true  | أدق من ===
console.log(Object.is(10, 10));   // true/Users/sc/Downloads/README.md