<Avatar
        hasTitle={false}
        size={45}
        variant="beam"
        name={userID}
        square={false}
        colors={["#0B8C61", "#3B35AC", "#73B06F", "#EAB308", "#405059"]}
/>

<script lang="ts">
    import {Avatar} from "@boringer-avatars/svelte/src/lib";

    export let userID: string;
</script>

