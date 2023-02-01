export default function TestPage() {
  return (
    <div className="max-w-4xl mx-5">
      <h1 className="flex justify-center">TEST PAGE</h1>
      <div className="grid grid-cols-2 gap-8 mt-2">
        <div className="grid bg-primary mr-1 h-64 w-64">
          <p className="self-center bg-secondary mx-2">
            THIS IS TEST SECTION 1: :THIS IS TEST SECTION1: :THIS IS TEST
            SECTION 1
          </p>
        </div>
        <div className="bg-secondary ml-1">
          THIS IS TEST SECTION 2: :THIS IS TEST SECTION 2: :THIS IS TEST SECTION
          2
        </div>
      </div>
      <div className="flex mt-2">
        <div className="bg-neutral mr-1 flex-none">
          THIS IS TEST SECTION 3: :THIS IS TEST SECTION 3: :THIS IS TEST SECTION
          3
        </div>
        <div className="bg-accent ml-1 flex-auto">
          THIS IS TEST SECTION 4: :THIS IS TEST SECTION 4: :THIS IS TEST SECTION
          4
        </div>
      </div>
    </div>
  );
}
