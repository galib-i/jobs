<script>
  import Button from "../ui/Button.svelte";
  import TextBox from "../ui/TextBox.svelte";

  let { onAddJob } = $props();

  const INITIAL_FORM = {
    company: "",
    role: "",
    location: "",
    link: "",
    description: "",
    notes: "",
  };

  const FIELD_CONFIG = [
    {
      key: "company",
      placeholder: "Company",
      rounded: "rounded-tl-xl rounded-bl-none rounded-r-none lg:rounded-bl-xl",
      border: "border border-b-2 border-r",
    },
    {
      key: "role",
      placeholder: "Role",
      rounded: "rounded-none",
      border: "border border-b-2 border-x",
    },
    {
      key: "location",
      placeholder: "Location",
      rounded: "rounded-tr-xl rounded-br-none rounded-l-none lg:rounded-tr-none",
      border: "border border-b-2 border-l lg:border-x",
    },
    {
      key: "link",
      placeholder: "Link",
      type: "url",
      rounded: "rounded-bl-xl rounded-tl-none rounded-r-none lg:rounded-bl-none",
      border: "border border-b-2 border-t-0 border-r lg:border-t lg:border-x",
    },
    {
      key: "description",
      placeholder: "Description",
      rounded: "rounded-none",
      border: "border border-b-2 border-t-0 border-x lg:border-t",
    },
    {
      key: "notes",
      placeholder: "Notes",
      rounded: "rounded-br-xl rounded-tr-none rounded-l-none lg:rounded-tr-xl",
      border: "border border-b-2 border-t-0 border-l lg:border-t",
    },
  ];

  let form = $state({ ...INITIAL_FORM });

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim()) return;
    onAddJob(form);
    form = { ...INITIAL_FORM };
  }
</script>

<form
  class="font-pixel mx-auto mb-6 flex w-full max-w-3xl flex-wrap items-center lg:max-w-none lg:flex-nowrap"
  onsubmit={handleSubmit}
>
  {#each FIELD_CONFIG as field}
    <TextBox
      type={field.type || "text"}
      class="w-1/3 lg:flex-1"
      position="middle"
      roundedOverride={field.rounded}
      borderOverride={field.border}
      bind:value={form[field.key]}
      placeholder={field.placeholder}
    />
  {/each}
  <Button theme="green" type="submit" class="mx-auto mt-4 text-sm lg:mx-0 lg:mt-0 lg:ml-4">
    ADD
  </Button>
</form>
