import { testFirebaseCRUD } from './src/lib/firebase.ts';

async function runTest() {
  const success = await testFirebaseCRUD();
  if (success) {
    console.log('Firebase CRUD test passed!');
  } else {
    console.error('Firebase CRUD test failed!');
    process.exit(1);
  }
}

runTest();
