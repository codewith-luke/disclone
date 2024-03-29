<script lang="ts">
    import {Search} from "lucide-svelte";
    import {slide} from 'svelte/transition';
    import {Key} from "w3c-keys";
    import {getUserStore} from "$lib/store";
    import HeaderActions from "./HeaderActions.svelte";
    import UserProfileAvatar from "./UserProfileAvatar.svelte";
    import {createAPIBridge} from "$lib/api-bridge";

    const user = getUserStore();
    const {profileApi} = createAPIBridge();

    let searchIsVisible = false;
    let searchBarEl: HTMLInputElement;

    $: if (searchBarEl && searchIsVisible) {
        searchBarEl.focus();
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.getModifierState(Key.Control) && event.key === Key.k) {
            event.preventDefault();
            searchIsVisible = !searchIsVisible;
        }

        if (event.key === Key.Escape) {
            if (!document?.activeElement ||
                document.activeElement.isEqualNode(document.body) ||
                document.activeElement.isEqualNode(searchBarEl)) {
                searchIsVisible = false;
            }
        }
    }

    async function handleDisplayNameChange(event: KeyboardEvent) {
        if (event.key === Key.Enter) {
            event.preventDefault();
            const content = event.target as HTMLElement;
            content.blur();

            const response = await profileApi.updateProfile({
                updateProfileRequest: {
                    displayName: content.textContent
                }
            });

            const {result, error} = response;

            if (error) {
                alert(error.message)
                return;
            }

            if (!result || !result.success) {
                alert("Something went wrong");
                return;
            }

            $user.displayName = content.textContent;
        }
    }

    function onSearchClick() {
        searchIsVisible = !searchIsVisible;
    }
</script>

<svelte:window on:keydown={handleKeydown}/>

{#if searchIsVisible}
    <div class="fixed top-0 left-0 h-full w-full z-20">
        <div class="fixed h-full w-full z-0 bg-surface-900 opacity-90"></div>
        <div class="relative flex mt-12 justify-center items-center w-full z-10">
            <div class="w-8/12" transition:slide|global={{ duration: 200, axis: 'x' }}>
                <input class="input py-1 px-4" type="search" placeholder="Search..." bind:this={searchBarEl}/>
            </div>
        </div>
    </div>
{/if}

<header class="flex relative justify-between gap-x-4 min-h-[5rem] bg-surface-900 drop-shadow-lg z-10">
    <div class="flex items-center w-48 pl-5">
        <UserProfileAvatar/>
        <span>
            {#if $user?.id}
                #{$user.id}
                <span contenteditable="true" role="textbox" tabindex="0" on:keydown={handleDisplayNameChange}>
                {$user.displayName}
            </span>
            {/if}
        </span>
    </div>
    <div class="flex flex-1 items-center">
        <div class="w-full flex items-center gap-x-4 justify-end">
            <button on:click={onSearchClick} class="text-surface-400 text-hover">
                <Search/>
            </button>
        </div>
    </div>
    <div class="flex justify-center items-center pr-10">
        <HeaderActions/>
    </div>
</header>