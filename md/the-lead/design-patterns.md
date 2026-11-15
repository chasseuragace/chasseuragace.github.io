---
title: Design Patterns in Dart
date: 2026-06-10
excerpt: All 23 Gang of Four patterns in Dart. For each one — what was going wrong, what the pattern fixes, and a minimal, runnable example. The wrong-way snippets are real patterns of pain, not strawmen.
---

# Design Patterns in Dart

All 23 GoF patterns. For each: what was going wrong, what the pattern fixes, and a minimal Dart example.

---

## Creational Patterns

---

### 1. Singleton

**What was going wrong**

People were either creating a new instance of expensive objects on every use (re-reading config from disk, opening a new DB connection per request), or passing a single object down through every function call as a parameter. Both hurt. The first wastes resources. The second pollutes every function signature with an object that has nothing to do with the function's actual job.

**What it fixes**

One instance, created once, accessible anywhere without passing it around. The class itself owns and guards the single instance.

```dart
class AppConfig {
  static final AppConfig _instance = AppConfig._internal();
  factory AppConfig() => _instance;
  AppConfig._internal();

  String env = 'production';
}

void main() {
  final a = AppConfig();
  final b = AppConfig();
  print(identical(a, b)); // true — same object
}
```

**Honest caveat**: Singleton is the most abused pattern. It is global state with a fancy name. Use it only for things that are genuinely singular by nature (config, logger, connection pool). If you find yourself making a Singleton because it is convenient to access, that is the wrong reason.

---

### 2. Factory Method

**What was going wrong**

Business logic was littered with `if/else` or `switch` blocks deciding which concrete class to instantiate. Every time a new type was added, you had to hunt through the codebase and update those branches. The calling code was coupled directly to concrete classes — it knew too much about what it was creating.

```dart
// The wrong way — caller knows about every type
void processLog(String type, String message) {
  if (type == 'console') {
    final logger = ConsoleLogger(); // hardcoded concrete class
    logger.log(message);
  } else if (type == 'file') {
    final logger = FileLogger();   // hardcoded concrete class
    logger.log(message);
  }
  // adding a new type means editing this function
}
```

**What it fixes**

Creation logic is moved behind an interface. The caller asks for a Logger and gets one. It never knows or cares which concrete class backs it.

```dart
abstract class Logger {
  void log(String message);
  factory Logger(String type) {
    switch (type) {
      case 'file':    return FileLogger();
      case 'console': return ConsoleLogger();
      default: throw ArgumentError('Unknown logger: $type');
    }
  }
}

class ConsoleLogger implements Logger {
  @override void log(String message) => print('[CONSOLE] $message');
}

class FileLogger implements Logger {
  @override void log(String message) => print('[FILE] $message');
}

void main() {
  final logger = Logger('console');
  logger.log('Hello'); // [CONSOLE] Hello
  // caller has no idea ConsoleLogger exists
}
```

---

### 3. Abstract Factory

**What was going wrong**

Factory Method handles one product. Abstract Factory handles the problem that arises when you have families of related products that must be used together, and you were mixing them. You were creating a Material button and accidentally pairing it with a Cupertino text field. The compiler did not catch it because both implement the same interface. The mismatch only showed at runtime.

```dart
// The wrong way — nothing stops you mixing families
final button = MaterialButton();
final field  = CupertinoTextField(); // wrong family, no compile error
```

**What it fixes**

One factory per family. You pick the factory once, and every product it creates is guaranteed to be from the same family. Mixing is structurally impossible.

```dart
abstract class Button    { void render(); }
abstract class TextField { void render(); }

class MaterialButton    implements Button    { @override void render() => print('Material Button'); }
class MaterialTextField implements TextField { @override void render() => print('Material TextField'); }
class CupertinoButton    implements Button    { @override void render() => print('Cupertino Button'); }
class CupertinoTextField implements TextField { @override void render() => print('Cupertino TextField'); }

abstract class UIFactory {
  Button createButton();
  TextField createTextField();
}

class MaterialFactory implements UIFactory {
  @override Button createButton()    => MaterialButton();
  @override TextField createTextField() => MaterialTextField();
}

class CupertinoFactory implements UIFactory {
  @override Button createButton()    => CupertinoButton();
  @override TextField createTextField() => CupertinoTextField();
}

void main() {
  UIFactory factory = MaterialFactory();
  factory.createButton().render();    // Material Button
  factory.createTextField().render(); // Material TextField
  // swap to CupertinoFactory and both change — impossible to mix
}
```

---

### 4. Builder

**What was going wrong**

Constructors with many optional parameters. You either had one massive constructor where half the arguments were null, or you had a dozen overloaded constructors for every combination. Both were unreadable and error-prone. Passing `null` as the 5th argument with no label tells the reader nothing.

```dart
// The wrong way — what does false mean here? what is null?
final user = User('Ajay', null, null, true, false, null, 42);
```

**What it fixes**

Construction is broken into named, readable steps. You only call the steps you need. The final `build()` assembles the object. The result is self-documenting.

```dart
class QueryBuilder {
  String _table = '';
  final List<String> _conditions = [];
  int? _limit;

  QueryBuilder from(String table)       { _table = table; return this; }
  QueryBuilder where(String condition)  { _conditions.add(condition); return this; }
  QueryBuilder limit(int n)             { _limit = n; return this; }

  String build() {
    var q = 'SELECT * FROM $_table';
    if (_conditions.isNotEmpty) q += ' WHERE ${_conditions.join(' AND ')}';
    if (_limit != null) q += ' LIMIT $_limit';
    return q;
  }
}

void main() {
  final query = QueryBuilder()
      .from('users')
      .where('active = true')
      .where('age > 18')
      .limit(10)
      .build();

  print(query);
  // SELECT * FROM users WHERE active = true AND age > 18 LIMIT 10
}
```

---

### 5. Prototype

**What was going wrong**

To copy a complex object people were manually reading every field and re-assigning them into a new instance. This breaks the moment the class adds a new field — the copy code silently misses it. It also forces the copying code to know about the internals of the object being copied, which is a violation of encapsulation.

```dart
// The wrong way — copying from outside
final copy = Circle(
  radius: original.radius, // must know every field
  color: original.color,   // add a field, this breaks silently
);
```

**What it fixes**

The object knows how to copy itself. The caller just says `clone()`. Adding a new field to the class means updating one place — the `clone()` method — not every place that copies it.

```dart
abstract class Shape {
  Shape clone();
  void describe();
}

class Circle implements Shape {
  double radius;
  String color;
  Circle({required this.radius, required this.color});

  @override Circle clone() => Circle(radius: radius, color: color);
  @override void describe() => print('Circle(radius: $radius, color: $color)');
}

void main() {
  final original = Circle(radius: 5.0, color: 'red');
  final copy = original.clone();
  copy.color = 'blue';

  original.describe(); // Circle(radius: 5.0, color: red)
  copy.describe();     // Circle(radius: 5.0, color: blue)
}
```

---

## Structural Patterns

---

### 6. Adapter

**What was going wrong**

You integrated a third-party library or inherited a legacy API. Its interface does not match what your code expects. People were either rewriting the third-party code (dangerous, breaks on updates) or scattering conversion logic at every call site (duplicated, error-prone).

```dart
// The wrong way — conversion logic leaks everywhere
void processPayment(double rupees) {
  final paisa = (rupees * 100).toInt(); // repeated at every call site
  legacyGateway.makePayment(paisa);
}
```

**What it fixes**

One adapter class wraps the incompatible API and translates. Every call site talks to the adapter using the interface it expects. The translation lives in exactly one place.

```dart
class LegacyPaymentGateway {
  void makePayment(int amountInPaisa) =>
      print('Legacy payment: $amountInPaisa paisa');
}

abstract class PaymentProcessor {
  void pay(double amountInRupees);
}

class PaymentAdapter implements PaymentProcessor {
  final LegacyPaymentGateway _gateway;
  PaymentAdapter(this._gateway);

  @override
  void pay(double amountInRupees) =>
      _gateway.makePayment((amountInRupees * 100).toInt());
}

void main() {
  final processor = PaymentAdapter(LegacyPaymentGateway());
  processor.pay(250.0); // Legacy payment: 25000 paisa
}
```

---

### 7. Bridge

**What was going wrong**

Inheritance was used to handle two independent dimensions of variation. If you have 2 shapes and 2 renderers, you end up with 4 subclasses. Add a third renderer and you need 2 more. The class count explodes multiplicatively. The two dimensions were fused into one hierarchy when they had nothing to do with each other.

```dart
// The wrong way — 2 shapes × 2 renderers = 4 classes, grows fast
class VectorCircle  extends Shape { ... }
class RasterCircle  extends Shape { ... }
class VectorSquare  extends Shape { ... }
class RasterSquare  extends Shape { ... }
// add one more renderer → 2 more classes. Add one shape → N more classes.
```

**What it fixes**

The two dimensions are separated into two independent hierarchies connected by composition. Shapes hold a reference to a Renderer. Adding a new renderer or a new shape is one class each, not a multiplication.

```dart
abstract class Renderer {
  void renderShape(String shape);
}

class VectorRenderer implements Renderer {
  @override void renderShape(String shape) => print('Drawing $shape as vectors');
}

class RasterRenderer implements Renderer {
  @override void renderShape(String shape) => print('Drawing $shape as pixels');
}

abstract class Shape {
  final Renderer renderer;
  Shape(this.renderer);
  void draw();
}

class Circle extends Shape {
  Circle(Renderer renderer) : super(renderer);
  @override void draw() => renderer.renderShape('circle');
}

class Square extends Shape {
  Square(Renderer renderer) : super(renderer);
  @override void draw() => renderer.renderShape('square');
}

void main() {
  Circle(VectorRenderer()).draw(); // Drawing circle as vectors
  Circle(RasterRenderer()).draw(); // Drawing circle as pixels
  // 2 shapes + 2 renderers = 4 classes total, not 4 subclasses
}
```

---

### 8. Composite

**What was going wrong**

Code that dealt with tree structures (file systems, UI widget trees, org charts) had separate handling for leaves and containers. Every piece of client code had to check: is this a file or a directory? Is this a widget or a container? The branching was everywhere and adding a new node type meant updating every check.

```dart
// The wrong way — client must always distinguish
void display(dynamic entity) {
  if (entity is File) {
    print(entity.name);
  } else if (entity is Directory) {
    print(entity.name);
    for (final child in entity.children) {
      display(child); // recursive, but the type check never goes away
    }
  }
}
```

**What it fixes**

Both leaves and containers implement the same interface. Client code calls `display()` on anything without knowing or caring whether it is a leaf or a container. The container handles its own recursion.

```dart
abstract class FileSystemEntity {
  String name;
  FileSystemEntity(this.name);
  void display(String indent);
}

class File extends FileSystemEntity {
  File(String name) : super(name);
  @override void display(String indent) => print('$indent- $name');
}

class Directory extends FileSystemEntity {
  final List<FileSystemEntity> _children = [];
  Directory(String name) : super(name);
  void add(FileSystemEntity e) => _children.add(e);

  @override
  void display(String indent) {
    print('$indent+ $name');
    for (final child in _children) child.display('$indent  ');
  }
}

void main() {
  final root = Directory('root');
  final src = Directory('src');
  src.add(File('main.dart'));
  src.add(File('app.dart'));
  root.add(src);
  root.add(File('pubspec.yaml'));
  root.display('');
  // + root
  //   + src
  //     - main.dart
  //     - app.dart
  //   - pubspec.yaml
}
```

---

### 9. Decorator

**What was going wrong**

Behavior was added through inheritance. You needed a logging service, so you extended UserService into LoggingUserService. Then you needed caching, so you extended that into CachingLoggingUserService. Every combination needed its own subclass. The hierarchy became deep, rigid, and impossible to recombine.

```dart
// The wrong way — one subclass per combination
class UserService { ... }
class LoggingUserService extends UserService { ... }
class CachingUserService extends UserService { ... }
class CachingLoggingUserService extends LoggingUserService { ... }
// want encryption too? another subclass for every combination
```

**What it fixes**

Wrappers. Each decorator wraps any object implementing the same interface and adds behavior before or after delegating. You compose behaviors at runtime by wrapping, not at compile time by inheriting. Any combination is possible with no new classes.

```dart
abstract class DataSource {
  void writeData(String data);
  String readData();
}

class FileDataSource implements DataSource {
  String _data = '';
  @override void writeData(String data) => _data = data;
  @override String readData() => _data;
}

class EncryptionDecorator implements DataSource {
  final DataSource _wrappee;
  EncryptionDecorator(this._wrappee);

  @override
  void writeData(String data) =>
      _wrappee.writeData(data.split('').reversed.join());

  @override
  String readData() => _wrappee.readData().split('').reversed.join();
}

class CompressionDecorator implements DataSource {
  final DataSource _wrappee;
  CompressionDecorator(this._wrappee);

  @override
  void writeData(String data) => _wrappee.writeData('[compressed]$data');

  @override
  String readData() => _wrappee.readData().replaceFirst('[compressed]', '');
}

void main() {
  // stack decorators in any order, no new subclass needed
  final source = EncryptionDecorator(CompressionDecorator(FileDataSource()));
  source.writeData('hello');
  print(source.readData()); // hello
}
```

---

### 10. Facade

**What was going wrong**

To perform one user-facing operation (get a profile, place an order) the caller had to orchestrate multiple subsystems in the correct order, knowing which services to call, in what sequence, with what parameters. That orchestration logic was either duplicated across multiple callers or the caller was coupled to internals it should never have known about.

```dart
// The wrong way — caller knows and orchestrates everything
void getProfile(String token, String userId) {
  final auth = AuthService();
  if (!auth.validate(token)) return;           // caller knows about auth
  final repo = UserRepository();
  final profile = repo.find(userId);           // caller knows about repo
  final logger = AuditLogger();
  logger.log('Profile fetched for $userId');   // caller knows about audit
  print(profile);
}
```

**What it fixes**

One facade method hides all the orchestration. Callers interact with one simple entry point. The subsystems are free to change internally without affecting callers.

```dart
class AuthService {
  bool validate(String token) => token == 'valid_token';
}

class UserRepository {
  Map<String, String> find(String id) => {'id': id, 'name': 'Chasseur'};
}

class AuditLogger {
  void log(String event) => print('[AUDIT] $event');
}

class UserProfileFacade {
  final _auth   = AuthService();
  final _repo   = UserRepository();
  final _logger = AuditLogger();

  Map<String, String>? getProfile(String token, String userId) {
    if (!_auth.validate(token)) return null;
    final profile = _repo.find(userId);
    _logger.log('Profile fetched for $userId');
    return profile;
  }
}

void main() {
  final facade = UserProfileFacade();
  print(facade.getProfile('valid_token', 'u42'));
  // {id: u42, name: Chasseur}
}
```

---

### 11. Flyweight

**What was going wrong**

Objects with large amounts of repeated data were being instantiated fully for every occurrence. Rendering 10,000 trees each storing their own name, texture, and color data when those values are shared among thousands of identical trees wastes enormous memory. Each object was fat when most of its data was identical to thousands of other objects.

```dart
// The wrong way — 10,000 trees, each with full duplicate data
class Tree {
  final int x, y;
  final String name;    // duplicated across thousands of trees
  final String color;   // duplicated across thousands of trees
  Tree(this.x, this.y, this.name, this.color);
}
// 10,000 Oak trees each store 'Oak' and 'green' separately
```

**What it fixes**

Shared (intrinsic) state is extracted into a flyweight object. Many instances reference the same flyweight. Only the unique (extrinsic) state like position lives per-instance. Memory drops dramatically.

```dart
class TreeType {
  final String name;
  final String color;
  TreeType(this.name, this.color);
  void draw(int x, int y) => print('Drawing $name ($color) at ($x,$y)');
}

class TreeTypeFactory {
  final Map<String, TreeType> _cache = {};
  TreeType get(String name, String color) =>
      _cache.putIfAbsent('$name-$color', () => TreeType(name, color));
}

class Tree {
  final int x, y;
  final TreeType type; // shared, not duplicated
  Tree(this.x, this.y, this.type);
  void draw() => type.draw(x, y);
}

void main() {
  final factory = TreeTypeFactory();
  final trees = [
    Tree(1, 2, factory.get('Oak', 'green')),
    Tree(5, 8, factory.get('Oak', 'green')), // same TreeType object reused
    Tree(3, 4, factory.get('Pine', 'dark-green')),
  ];
  for (final t in trees) t.draw();
}
```

---

### 12. Proxy

**What was going wrong**

Expensive operations (loading from disk, network calls, access-controlled resources) were executed eagerly and unconditionally. There was no interception point to add caching, lazy loading, access control, or logging without modifying the original class.

```dart
// The wrong way — always loads immediately, no interception possible
class ImageViewer {
  void show(String filename) {
    final image = RealImage(filename); // loads from disk every time
    image.display();
  }
}
```

**What it fixes**

A proxy sits in front of the real object, implements the same interface, and controls access to it. The client never knows the difference. The proxy can lazy-load, cache, log, or check permissions before delegating.

```dart
abstract class Image {
  void display();
}

class RealImage implements Image {
  final String filename;
  RealImage(this.filename) {
    print('Loading $filename from disk...');
  }
  @override void display() => print('Displaying $filename');
}

class ProxyImage implements Image {
  final String filename;
  RealImage? _real;
  ProxyImage(this.filename);

  @override
  void display() {
    _real ??= RealImage(filename); // load only when first needed
    _real!.display();
  }
}

void main() {
  final img = ProxyImage('photo.png');
  print('Created — nothing loaded yet');
  img.display(); // loads now
  img.display(); // reuses cached — no second load
}
```

---

## Behavioral Patterns

---

### 13. Chain of Responsibility

**What was going wrong**

Request handling logic was one giant `if/else` block. One function knew about every possible handler, every condition, and every escalation path. Adding a new handler meant editing that central function. The handlers were tightly coupled to each other through that one function, and none could be reused independently.

```dart
// The wrong way — one function owns all handler knowledge
void handle(int request) {
  if (request < 10)       { lowHandler(request); }
  else if (request < 100) { midHandler(request); }
  else                    { highHandler(request); }
  // adding a new tier means editing this function
}
```

**What it fixes**

Each handler knows only about itself and its successor. The chain is assembled externally. Adding or reordering handlers does not touch existing handler code.

```dart
abstract class Handler {
  Handler? next;
  Handler setNext(Handler h) { next = h; return h; }
  void handle(int request);
}

class LowLevelHandler extends Handler {
  @override void handle(int request) {
    if (request < 10) print('LowLevel handled $request');
    else next?.handle(request);
  }
}

class MidLevelHandler extends Handler {
  @override void handle(int request) {
    if (request < 100) print('MidLevel handled $request');
    else next?.handle(request);
  }
}

class HighLevelHandler extends Handler {
  @override void handle(int request) => print('HighLevel handled $request');
}

void main() {
  final low = LowLevelHandler();
  low.setNext(MidLevelHandler()).setNext(HighLevelHandler());
  low.handle(5);   // LowLevel handled 5
  low.handle(50);  // MidLevel handled 50
  low.handle(500); // HighLevel handled 500
}
```

---

### 14. Command

**What was going wrong**

Operations were called directly as method calls. You could not queue them, log them, delay them, or reverse them because a method call is a fire-and-forget event with no record. Undo functionality required manually tracking what happened and writing reverse logic scattered throughout the codebase.

```dart
// The wrong way — direct call, nothing to undo, nothing to queue
editor.write('Hello');
// how do you undo this? you have to know what was written and implement
// reverse logic at the call site every single time
```

**What it fixes**

Each operation is an object. It carries its parameters and knows how to execute and undo itself. You can store commands, replay them, reverse them, or queue them as first-class values.

```dart
abstract class Command {
  void execute();
  void undo();
}

class TextEditor {
  String _text = '';
  void write(String text)      => _text += text;
  void deleteLast(int n)       => _text = _text.substring(0, _text.length - n);
  String get text              => _text;
}

class WriteCommand implements Command {
  final TextEditor _editor;
  final String _text;
  WriteCommand(this._editor, this._text);
  @override void execute() => _editor.write(_text);
  @override void undo()    => _editor.deleteLast(_text.length);
}

class CommandHistory {
  final _history = <Command>[];
  void execute(Command cmd) { cmd.execute(); _history.add(cmd); }
  void undo() { if (_history.isNotEmpty) _history.removeLast().undo(); }
}

void main() {
  final editor  = TextEditor();
  final history = CommandHistory();

  history.execute(WriteCommand(editor, 'Hello'));
  history.execute(WriteCommand(editor, ' World'));
  print(editor.text); // Hello World
  history.undo();
  print(editor.text); // Hello
}
```

---

### 15. Interpreter

**What was going wrong**

Parsing and evaluating custom expressions or mini-languages was done with brittle string manipulation — splitting on spaces, indexing into arrays, handling edge cases with if-chains. It broke on nested expressions and was nearly impossible to extend with new operations without rewriting the whole parser.

```dart
// The wrong way — string-split parsing, breaks on nesting
int evaluate(String expr) {
  final parts = expr.split(' ');
  if (parts[1] == '+') return int.parse(parts[0]) + int.parse(parts[2]);
  // nested expressions? parentheses? operator precedence? good luck
}
```

**What it fixes**

Each grammar rule becomes a class. Expressions are trees of these objects. Evaluating means calling `interpret()` recursively. New operations are new classes, not new branches in a parser.

```dart
abstract class Expression {
  int interpret();
}

class NumberExpression implements Expression {
  final int value;
  NumberExpression(this.value);
  @override int interpret() => value;
}

class AddExpression implements Expression {
  final Expression left, right;
  AddExpression(this.left, this.right);
  @override int interpret() => left.interpret() + right.interpret();
}

class MultiplyExpression implements Expression {
  final Expression left, right;
  MultiplyExpression(this.left, this.right);
  @override int interpret() => left.interpret() * right.interpret();
}

void main() {
  // (3 + 4) * 2
  final expr = MultiplyExpression(
    AddExpression(NumberExpression(3), NumberExpression(4)),
    NumberExpression(2),
  );
  print(expr.interpret()); // 14
}
```

---

### 16. Iterator

**What was going wrong**

To traverse a collection you needed to know its internal structure. Array? Use an index. Linked list? Follow `.next` pointers. Tree? Write a recursive traversal. Every data structure exposed its internals and every caller was coupled to them. Changing the underlying structure broke all the traversal code.

```dart
// The wrong way — caller is coupled to internal structure
for (var i = 0; i < list.length; i++) { // knows it's an array
  print(list[i]);
}
// switch to a linked list and this entire traversal breaks
```

**What it fixes**

A standard traversal interface hides the internal structure entirely. The caller only knows `moveNext()` and `current`. The collection can change its internals without affecting traversal code. In Dart this integrates directly with the language's `for-in` loop.

```dart
class Range implements Iterable<int> {
  final int start, end;
  Range(this.start, this.end);

  @override
  Iterator<int> get iterator => _RangeIterator(start, end);
}

class _RangeIterator implements Iterator<int> {
  int _current;
  final int _end;
  _RangeIterator(int start, this._end) : _current = start - 1;

  @override int get current => _current;
  @override bool moveNext() { _current++; return _current <= _end; }
}

void main() {
  for (final n in Range(1, 5)) {
    print(n); // 1 2 3 4 5
  }
  // caller has no idea how Range stores its data
}
```

---

### 17. Mediator

**What was going wrong**

Components were talking directly to each other. Component A held a reference to B and C, B held a reference to A and C, C held a reference to A and B. Every component knew about every other component. The coupling was N-squared. Changing one component required understanding and potentially modifying all the others.

```dart
// The wrong way — everyone knows everyone
class OrderService {
  final NotificationService _notif;
  final InventoryService _inv;
  final AnalyticsService _analytics;
  // OrderService depends on three concrete classes
  // adding a fourth means editing OrderService
}
```

**What it fixes**

All components talk to a mediator instead of each other. The mediator knows everyone; no one else knows anyone. Adding a new component means registering it with the mediator, not modifying existing components.

```dart
class EventBus {
  final Map<String, List<Function>> _listeners = {};

  void on(String event, Function handler) =>
      _listeners.putIfAbsent(event, () => []).add(handler);

  void emit(String event, dynamic data) =>
      _listeners[event]?.forEach((h) => h(data));
}

void main() {
  final bus = EventBus();

  bus.on('order.placed', (data) => print('Notification: $data'));
  bus.on('order.placed', (data) => print('Analytics: $data'));
  bus.on('order.placed', (data) => print('Inventory: reserving for $data'));

  bus.emit('order.placed', 'Order #123');
  // adding a fourth listener touches zero existing code
}
```

---

### 18. Memento

**What was going wrong**

To implement undo, people either exposed an object's internals publicly (so external code could snapshot and restore them) or they duplicated state management logic throughout the codebase. Exposing internals broke encapsulation. Duplicating logic meant bugs in undo were hard to track down.

```dart
// The wrong way — external code reaches into internals to snapshot
final backup = editor._content; // accessing private state
editor._content = 'Version 1';  // directly mutating private state
// encapsulation is gone, the object has lost control of its own state
```

**What it fixes**

The object creates and restores its own snapshots (Mementos). The snapshot is opaque to everyone else — they can store it but cannot read or modify it. Encapsulation is preserved and undo logic lives in one place.

```dart
class EditorState {
  final String content;
  EditorState(this.content); // opaque snapshot — just stores, no logic
}

class Editor {
  String _content = '';
  set content(String v) => _content = v;
  String get content    => _content;

  EditorState save()                  => EditorState(_content);
  void restore(EditorState state)     => _content = state.content;
}

class History {
  final _states = <EditorState>[];
  void push(EditorState s)   => _states.add(s);
  EditorState? pop()         => _states.isNotEmpty ? _states.removeLast() : null;
}

void main() {
  final editor  = Editor();
  final history = History();

  editor.content = 'Version 1'; history.push(editor.save());
  editor.content = 'Version 2'; history.push(editor.save());
  editor.content = 'Version 3';
  print(editor.content);              // Version 3
  editor.restore(history.pop()!);
  print(editor.content);              // Version 2
  editor.restore(history.pop()!);
  print(editor.content);              // Version 1
}
```

---

### 19. Observer

**What was going wrong**

Two approaches were common, both bad. The first was polling: checking every N milliseconds whether something had changed, burning CPU on nothing. The second was manual notification: whenever state changed you explicitly called every dependent object, meaning you had to know all dependents and update the notification list every time one was added or removed.

```dart
// The wrong way — manual notification, tightly coupled
class Order {
  void place() {
    // must know about every dependent and call them manually
    emailService.sendConfirmation(this);   // coupled
    analyticsService.track(this);          // coupled
    inventoryService.reserve(this);        // coupled
    // add a new dependent? edit this method
  }
}
```

**What it fixes**

Dependents register themselves. The subject only knows there is a list of observers; it does not know who they are. Adding or removing a dependent requires no changes to the subject.

```dart
abstract class Observer {
  void update(String event, dynamic data);
}

class EventEmitter {
  final Map<String, List<Observer>> _observers = {};

  void subscribe(String event, Observer observer) =>
      _observers.putIfAbsent(event, () => []).add(observer);

  void notify(String event, dynamic data) =>
      _observers[event]?.forEach((o) => o.update(event, data));
}

class EmailNotifier implements Observer {
  @override void update(String event, dynamic data) =>
      print('Email: $event -> $data');
}

class PushNotifier implements Observer {
  @override void update(String event, dynamic data) =>
      print('Push: $event -> $data');
}

void main() {
  final emitter = EventEmitter();
  emitter.subscribe('order.placed', EmailNotifier());
  emitter.subscribe('order.placed', PushNotifier());
  emitter.notify('order.placed', 'Order #123');
  // Email: order.placed -> Order #123
  // Push: order.placed -> Order #123
}
```

---

### 20. State

**What was going wrong**

State-dependent behavior was implemented as a growing set of `if/else` or `switch` blocks inside the object's methods. Every method had to check the current state and branch. Adding a new state meant finding every single method that branched on state and adding a new case to each. They were easy to miss, leading to inconsistent behavior.

```dart
// The wrong way — state checks scattered across every method
class TrafficLight {
  String _state = 'red';

  void next() {
    if (_state == 'red')    _state = 'green';   // state logic here
    else if (_state == 'green')  _state = 'yellow';
    else if (_state == 'yellow') _state = 'red';
  }

  void display() {
    if (_state == 'red')    print('Stop');       // and here
    else if (_state == 'green')  print('Go');
    else if (_state == 'yellow') print('Slow');
    // add a new state? update every method
  }
}
```

**What it fixes**

Each state becomes its own class containing all behavior for that state. The host object delegates to the current state object. Adding a new state is adding one new class with no changes to existing state classes.

```dart
abstract class TrafficLightState {
  void handle(TrafficLight light);
}

class RedState implements TrafficLightState {
  @override void handle(TrafficLight light) {
    print('Red — stop. Switching to green.');
    light.state = GreenState();
  }
}

class GreenState implements TrafficLightState {
  @override void handle(TrafficLight light) {
    print('Green — go. Switching to yellow.');
    light.state = YellowState();
  }
}

class YellowState implements TrafficLightState {
  @override void handle(TrafficLight light) {
    print('Yellow — slow. Switching to red.');
    light.state = RedState();
  }
}

class TrafficLight {
  TrafficLightState state;
  TrafficLight() : state = RedState();
  void next() => state.handle(this);
}

void main() {
  final light = TrafficLight();
  light.next(); // Red — stop
  light.next(); // Green — go
  light.next(); // Yellow — slow
  light.next(); // Red — stop
}
```

---

### 21. Strategy

**What was going wrong**

Swappable algorithms or behaviors were implemented as branching logic inside the host class. Payment type? `if (type == 'stripe')... else if (type == 'esewa')...`. Sorting method? A `switch` inside `sort()`. Every time a new variant was needed the host class was edited, making it fatter and more fragile over time. This violated the open-closed principle: the class was not closed for modification.

```dart
// The wrong way — host class owns all algorithm variants
class Sorter {
  void sort(List<int> data, String algorithm) {
    if (algorithm == 'bubble') {
      // bubble sort logic here
    } else if (algorithm == 'quick') {
      // quick sort logic here
    }
    // add a new algorithm? edit this class
  }
}
```

**What it fixes**

Each algorithm is its own unit. The host holds a reference to the current strategy and delegates to it. Swapping algorithms at runtime is a single assignment. Adding a new one does not touch the host.

```dart
typedef SortStrategy = void Function(List<int> data);

void bubbleSort(List<int> data) {
  for (var i = 0; i < data.length - 1; i++)
    for (var j = 0; j < data.length - i - 1; j++)
      if (data[j] > data[j + 1]) {
        final tmp = data[j]; data[j] = data[j + 1]; data[j + 1] = tmp;
      }
}

void dartSort(List<int> data) => data.sort();

class Sorter {
  SortStrategy _strategy;
  Sorter(this._strategy);
  set strategy(SortStrategy s) => _strategy = s;
  void sort(List<int> data)    => _strategy(data);
}

void main() {
  final sorter = Sorter(dartSort);
  final data = [5, 3, 1, 4, 2];
  sorter.sort(data);
  print(data); // [1, 2, 3, 4, 5]

  sorter.strategy = bubbleSort; // swap at runtime, no conditional needed
  final data2 = [9, 7, 6, 8];
  sorter.sort(data2);
  print(data2); // [6, 7, 8, 9]
}
```

---

### 22. Template Method

**What was going wrong**

Similar multi-step processes were either fully duplicated across classes (copy-paste with slight variations, diverging over time) or crammed into one class with conditional branches to handle each variation. Both were maintenance problems. The shared skeleton of the algorithm was either repeated or buried under conditions.

```dart
// The wrong way — duplicated skeleton
class CsvExporter {
  void export(List data) {
    final formatted = formatAsCsv(data); // step 1 — duplicated
    if (formatted.isEmpty) return;       // step 2 — duplicated
    writeToDisk(formatted);              // step 3 — duplicated
  }
}

class JsonExporter {
  void export(List data) {
    final formatted = formatAsJson(data); // step 1 — duplicated
    if (formatted.isEmpty) return;        // step 2 — duplicated
    writeToDisk(formatted);               // step 3 — duplicated
  }
}
// the skeleton (format → validate → write) is copy-pasted
```

**What it fixes**

The skeleton is defined once in a base class as a template method. Subclasses override only the steps that vary. The invariant structure is written once and never duplicated.

```dart
abstract class DataExporter {
  void export(List<Map<String, dynamic>> data) {
    final formatted = format(data);          // step 1 — varies
    if (!validate(formatted)) return;        // step 2 — default provided
    write(formatted);                        // step 3 — varies
  }

  String format(List<Map<String, dynamic>> data);
  bool validate(String data) => data.isNotEmpty; // shared default
  void write(String data);
}

class CsvExporter extends DataExporter {
  @override String format(List<Map<String, dynamic>> data) =>
      data.map((row) => row.values.join(',')).join('\n');
  @override void write(String data) => print('CSV:\n$data');
}

class JsonExporter extends DataExporter {
  @override String format(List<Map<String, dynamic>> data) => data.toString();
  @override void write(String data) => print('JSON:\n$data');
}

void main() {
  final rows = [
    {'name': 'Ajay', 'role': 'architect'},
    {'name': 'Riya', 'role': 'engineer'},
  ];
  CsvExporter().export(rows);
  JsonExporter().export(rows);
}
```

---

### 23. Visitor

**What was going wrong**

Adding a new operation to a class hierarchy meant modifying every class in the hierarchy. You had a Document with Heading, Paragraph, and Image elements. You wanted to add HTML export. Then Markdown export. Then word count. Every new operation meant editing every element class. The classes were accumulating methods that had nothing to do with their core responsibility.

```dart
// The wrong way — every new operation pollutes every class
class Heading {
  String toHtml()     => '<h1>$text</h1>';     // operation 1
  String toMarkdown() => '# $text';             // operation 2
  int wordCount()     => text.split(' ').length; // operation 3
  // each new operation added here, to every element class
}
```

**What it fixes**

Operations are extracted into Visitor classes. Element classes only implement `accept(visitor)`. Adding a new operation is a new Visitor class — element classes are never touched. The classes stay focused on what they are, not what can be done with them.

```dart
abstract class DocumentElement {
  void accept(Visitor visitor);
}

class Heading implements DocumentElement {
  final String text;
  Heading(this.text);
  @override void accept(Visitor visitor) => visitor.visitHeading(this);
}

class Paragraph implements DocumentElement {
  final String text;
  Paragraph(this.text);
  @override void accept(Visitor visitor) => visitor.visitParagraph(this);
}

abstract class Visitor {
  void visitHeading(Heading h);
  void visitParagraph(Paragraph p);
}

class HtmlExportVisitor implements Visitor {
  @override void visitHeading(Heading h)   => print('<h1>${h.text}</h1>');
  @override void visitParagraph(Paragraph p) => print('<p>${p.text}</p>');
}

class MarkdownExportVisitor implements Visitor {
  @override void visitHeading(Heading h)   => print('# ${h.text}');
  @override void visitParagraph(Paragraph p) => print('\n${p.text}\n');
}

class WordCountVisitor implements Visitor {
  int count = 0;
  @override void visitHeading(Heading h)   => count += h.text.split(' ').length;
  @override void visitParagraph(Paragraph p) => count += p.text.split(' ').length;
}

void main() {
  final doc = <DocumentElement>[
    Heading('Design Patterns'),
    Paragraph('Reusable solutions to common problems.'),
  ];

  print('--- HTML ---');
  final html = HtmlExportVisitor();
  for (final el in doc) el.accept(html);

  print('--- Markdown ---');
  final md = MarkdownExportVisitor();
  for (final el in doc) el.accept(md);

  final wc = WordCountVisitor();
  for (final el in doc) el.accept(wc);
  print('Word count: ${wc.count}');
  // Heading and Paragraph never changed to add word counting
}
```

---

## Notes

- All 23 compile and run in Dart 3.x.
- The wrong-way examples are real patterns of pain, not invented strawmen. You will recognize them if you have read enough codebases.
- Dart's `factory` constructor makes Factory Method unusually clean compared to most languages.
- `typedef` for Strategy avoids an unnecessary abstract class when the strategy is a pure function.
- Observer and Mediator solve related but different problems. Observer is one-to-many notification. Mediator is many-to-many decoupling. In Flutter, `ChangeNotifier`, `Stream`, and `ValueNotifier` are all Observer implementations.
- For Singleton in real Flutter projects, use `get_it` instead of a raw static instance. Same pattern, but the container makes it replaceable in tests.
