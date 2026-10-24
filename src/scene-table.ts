// CSS layers share a real 3D coordinate space: tabletop, slab, upright net and legs.
export const tableArt = `<div class="table-floor" aria-hidden="true"></div><div class="table-dimension" aria-hidden="true">
<div class="table-underframe"></div>
<div class="table-leg leg-fl"></div><div class="table-leg leg-fr"></div><div class="table-leg leg-bl"></div><div class="table-leg leg-br"></div>
<div class="table-slab side-front"></div><div class="table-slab side-back"></div><div class="table-slab side-left"></div><div class="table-slab side-right"></div>
<div class="table-top"><div class="table-center-line"></div><div class="table-surface-glint"></div></div>
<div class="table-net-shadow"></div><div class="court-net"><div class="net-mesh"></div><div class="net-top-band"></div><div class="net-post post-left"></div><div class="net-post post-right"></div></div>
</div>`;
