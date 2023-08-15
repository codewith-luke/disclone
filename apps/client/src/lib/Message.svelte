<div class="grid grid-cols-[auto_1fr] gap-2">
    <Avatar src="https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
            width="w-12"/>
    <div class="card p-4 variant-soft rounded-tl-none space-y-2">
        <header class="flex justify-between items-center">
            <p class="font-bold">Ricardo Cooper</p>
            <small class="opacity-50">{new Date().toLocaleDateString('en-GB')}</small>
        </header>
        <p>This is a message</p>
    </div>
</div>


<script>
    import {Avatar} from "@skeletonlabs/skeleton";
</script>