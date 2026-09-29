export { VfxCanvas, type VfxCanvasProps } from "./VfxCanvas.tsx";
export {
  usePointerUniforms,
  POINTER_REST,
  POINTER_STILL,
  type PointerUniform,
  type PointerVelocity,
} from "./usePointerUniforms.ts";
export { WaveBackground, WAVE_SHADER, type WaveBackgroundProps } from "./components/WaveBackground.tsx";
export {
  FluidGradient,
  FLUID_SHADER,
  FLUID_DEFAULTS,
  FLUID_PRESETS,
  type FluidGradientProps,
} from "./components/FluidGradient.tsx";
export {
  Aurora,
  AURORA_SHADER,
  AURORA_DEFAULTS,
  AURORA_PRESETS,
  type AuroraProps,
} from "./components/Aurora.tsx";
export {
  Starfield,
  STARFIELD_SHADER,
  STARFIELD_DEFAULTS,
  STARFIELD_PRESETS,
  type StarfieldProps,
} from "./components/Starfield.tsx";
export {
  ParticleField,
  PARTICLE_SHADER,
  PARTICLE_DEFAULTS,
  PARTICLE_PRESETS,
  type ParticleFieldProps,
} from "./components/ParticleField.tsx";
export {
  GlassCard,
  GLASS_CARD_SHADER,
  GLASS_CARD_DEFAULTS,
  GLASS_CARD_PRESETS,
  type GlassCardProps,
} from "./components/GlassCard.tsx";
export {
  LiquidGlass,
  LIQUID_GLASS_SHADER,
  LIQUID_GLASS_DEFAULTS,
  LIQUID_GLASS_PRESETS,
  type LiquidGlassProps,
} from "./components/LiquidGlass.tsx";
export {
  GlassLens,
  GLASS_LENS_SHADER,
  GLASS_LENS_DEFAULTS,
  GLASS_LENS_PRESETS,
  type GlassLensProps,
} from "./components/GlassLens.tsx";
export {
  BlackHole,
  BLACK_HOLE_BAKE_SHADER,
  BLACK_HOLE_REFINE_SHADER,
  BLACK_HOLE_SHADE_SHADER,
  BLACK_HOLE_BLOOM_SHADER,
  BLACK_HOLE_COMPOSITE_SHADER,
  BLACK_HOLE_DEFAULTS,
  BLACK_HOLE_PRESETS,
  defaultBlackHoleSettings,
  renderBlackHoleThumbnail,
  type BlackHoleProps,
  type BlackHoleSettings,
} from "./components/BlackHole.tsx";
export {
  MeshGradient,
  MESH_GRADIENT_SHADER,
  MESH_GRADIENT_PRESETS,
  type MeshGradientProps,
} from "./components/MeshGradient.tsx";
export {
  Iridescent,
  IRIDESCENT_SHADER,
  IRIDESCENT_PRESETS,
  type IridescentProps,
} from "./components/Iridescent.tsx";
export {
  Vortex,
  VORTEX_SHADER,
  VORTEX_PRESETS,
  type VortexProps,
} from "./components/Vortex.tsx";
export {
  RibbonField,
  RIBBON_FIELD_SHADER,
  RIBBON_FIELD_DEFAULTS,
  RIBBON_FIELD_PRESETS,
  type RibbonFieldProps,
} from "./components/RibbonField.tsx";
export {
  FiberFlow,
  FIBER_FLOW_SHADER,
  FIBER_FLOW_DEFAULTS,
  FIBER_FLOW_PRESETS,
  type FiberFlowProps,
} from "./components/FiberFlow.tsx";
export {
  ChromaFlow,
  CHROMA_FLOW_SHADER,
  CHROMA_FLOW_DEFAULTS,
  CHROMA_FLOW_PRESETS,
  type ChromaFlowProps,
} from "./components/ChromaFlow.tsx";
export {
  LightPrism,
  LIGHT_PRISM_SHADER,
  LIGHT_PRISM_DEFAULTS,
  LIGHT_PRISM_PRESETS,
  type LightPrismProps,
} from "./components/LightPrism.tsx";
export { HeroShell, type HeroShellProps, type HeroLayout, type HeroCta } from "./components/HeroShell.tsx";
export { HeroFluid, HERO_FLUID_PRESETS, type HeroFluidProps } from "./components/HeroFluid.tsx";
export { HeroAurora, HERO_AURORA_PRESETS, type HeroAuroraProps } from "./components/HeroAurora.tsx";
export { HeroFiber, HERO_FIBER_PRESETS, type HeroFiberProps } from "./components/HeroFiber.tsx";
export { HeroGlobe, HERO_GLOBE_PRESETS, type HeroGlobeProps } from "./components/HeroGlobe.tsx";
export { HeroMesh, HERO_MESH_PRESETS, type HeroMeshProps } from "./components/HeroMesh.tsx";
export { HeroIridescent, HERO_IRIDESCENT_PRESETS, type HeroIridescentProps } from "./components/HeroIridescent.tsx";
export { HeroVortex, HERO_VORTEX_PRESETS, type HeroVortexProps } from "./components/HeroVortex.tsx";
export { HeroRibbon, HERO_RIBBON_PRESETS, type HeroRibbonProps } from "./components/HeroRibbon.tsx";
export { HeroParticles, HERO_PARTICLES_PRESETS, type HeroParticlesProps } from "./components/HeroParticles.tsx";
export { HeroStarfield, HERO_STARFIELD_PRESETS, type HeroStarfieldProps } from "./components/HeroStarfield.tsx";
export { HeroBlackHole, HERO_BLACK_HOLE_PRESETS, type HeroBlackHoleProps } from "./components/HeroBlackHole.tsx";
export { HeroChroma, HERO_CHROMA_PRESETS, type HeroChromaProps } from "./components/HeroChroma.tsx";
export { hexToRgb01 } from "./utils/color.ts";
export { Magnetic, type MagneticProps } from "./components/Magnetic";
export { SpectralCard, type SpectralCardProps } from "./components/SpectralCard";
export { KineticText, type KineticTextProps } from "./components/KineticText";
export { type HeroContentProps } from "./components/HeroShell";

export { FooterTidal, type FooterTidalProps } from "./components/FooterTidal.tsx";
export { FooterFold, type FooterFoldProps } from "./components/FooterFold.tsx";
export { FooterPhosphor, type FooterPhosphorProps } from "./components/FooterPhosphor.tsx";
export type { FooterContentProps, FooterLink, FooterLinkGroup } from "./components/FooterFrame.tsx";

export { RadiantDots, RADIANT_DOTS_PRESETS, type RadiantDotsProps } from "./components/RadiantDots.tsx";

export { AstraField, ASTRA_FIELD_PRESETS, type AstraFieldProps } from "./components/AstraField.tsx";

export { HeroEclipse, type HeroEclipseProps } from "./components/HeroEclipse.tsx";
export { HeroContour, type HeroContourProps } from "./components/HeroContour.tsx";
export { FooterVinyl, type FooterVinylProps } from "./components/FooterVinyl.tsx";

/* --- Blocks: complete, installable page sections --- */
export { BlockNav, type BlockNavProps, type NavLink } from "./components/BlockNav.tsx";
export { BlockShowcase, type BlockShowcaseProps } from "./components/BlockShowcase.tsx";
export { BlockFeatureGrid, type BlockFeatureGridProps, type FeatureGridItem } from "./components/BlockFeatureGrid.tsx";
export { BlockFeatureTabs, type BlockFeatureTabsProps, type FeatureTab } from "./components/BlockFeatureTabs.tsx";
export { BlockScrollStory, type BlockScrollStoryProps, type StoryStep } from "./components/BlockScrollStory.tsx";
export { BlockProcessSteps, type BlockProcessStepsProps, type ProcessStep } from "./components/BlockProcessSteps.tsx";
export { BlockIntegrations, type BlockIntegrationsProps, type Integration } from "./components/BlockIntegrations.tsx";
export { BlockComparison, type BlockComparisonProps } from "./components/BlockComparison.tsx";
export { BlockTestimonials, type BlockTestimonialsProps, type Testimonial } from "./components/BlockTestimonials.tsx";
export { BlockPricing, type BlockPricingProps, type PricingPlan } from "./components/BlockPricing.tsx";
export { BlockFaq, type BlockFaqProps, type FaqItem } from "./components/BlockFaq.tsx";
export { BlockCta, type BlockCtaProps } from "./components/BlockCta.tsx";
export type { BlockAction } from "./components/blockShared.tsx";
export { ExampleLaunch } from "./components/ExampleLaunch.tsx";
export { ExampleStudio } from "./components/ExampleStudio.tsx";

// ── 2026-09-28 agent batches A–D ──
export { EMBER_DRIFT_DEFAULTS, EMBER_DRIFT_PRESETS, EMBER_DRIFT_SHADER, EmberDrift, type EmberDriftProps } from "./components/EmberDrift.tsx";
export { CAUSTICS_FIELD_DEFAULTS, CAUSTICS_FIELD_PRESETS, CAUSTICS_FIELD_SHADER, CausticsField, type CausticsFieldProps } from "./components/CausticsField.tsx";
export { HALO_RINGS_DEFAULTS, HALO_RINGS_PRESETS, HALO_RINGS_SHADER, HaloRings, type HaloRingsProps } from "./components/HaloRings.tsx";
export { TERRAIN_RIDGE_DEFAULTS, TERRAIN_RIDGE_PRESETS, TERRAIN_RIDGE_SHADER, TerrainRidge, type TerrainRidgeProps } from "./components/TerrainRidge.tsx";
export { SILK_VEIL_DEFAULTS, SILK_VEIL_PRESETS, SILK_VEIL_SHADER, SilkVeil, type SilkVeilProps } from "./components/SilkVeil.tsx";
export { PLASMA_SHEET_DEFAULTS, PLASMA_SHEET_PRESETS, PLASMA_SHEET_SHADER, PlasmaSheet, type PlasmaSheetProps } from "./components/PlasmaSheet.tsx";
export { STAR_TIDE_DEFAULTS, STAR_TIDE_PRESETS, STAR_TIDE_SHADER, StarTide, type StarTideProps } from "./components/StarTide.tsx";
export { INK_BLOOM_DEFAULTS, INK_BLOOM_PRESETS, INK_BLOOM_SHADER, InkBloom, type InkBloomProps } from "./components/InkBloom.tsx";
export { SOLAR_CORONA_DEFAULTS, SOLAR_CORONA_PRESETS, SOLAR_CORONA_SHADER, SolarCorona, type SolarCoronaProps } from "./components/SolarCorona.tsx";
export { DUST_MOTES_DEFAULTS, DUST_MOTES_PRESETS, DUST_MOTES_SHADER, DustMotes, type DustMotesProps } from "./components/DustMotes.tsx";
export { HERO_AURORA_EDITORIAL_PRESETS, HeroAuroraEditorial, type HeroAuroraEditorialProps } from "./components/HeroAuroraEditorial.tsx";
export { HERO_STARFIELD_SPLIT_PRESETS, HeroStarfieldSplit, type HeroStarfieldSplitProps } from "./components/HeroStarfieldSplit.tsx";
export { HERO_VORTEX_CENTERED_PRESETS, HeroVortexCentered, type HeroVortexCenteredProps } from "./components/HeroVortexCentered.tsx";
export { HERO_MESH_BOLD_PRESETS, HeroMeshBold, type HeroMeshBoldProps } from "./components/HeroMeshBold.tsx";
export { HERO_FIBER_TOP_PRESETS, HeroFiberTop, type HeroFiberTopProps } from "./components/HeroFiberTop.tsx";
export { HERO_CHROMA_FULL_PRESETS, HeroChromaFull, type HeroChromaFullProps } from "./components/HeroChromaFull.tsx";
export { HERO_BLACK_HOLE_CINEMA_PRESETS, HeroBlackHoleCinema, type HeroBlackHoleCinemaProps } from "./components/HeroBlackHoleCinema.tsx";
export { HERO_PARTICLES_BADGE_PRESETS, HeroParticlesBadge, type HeroParticlesBadgeProps } from "./components/HeroParticlesBadge.tsx";
export { HERO_RIBBON_LEFT_PRESETS, HeroRibbonLeft, type HeroRibbonLeftProps } from "./components/HeroRibbonLeft.tsx";
export { HERO_FLUID_MINIMAL_PRESETS, HeroFluidMinimal, type HeroFluidMinimalProps } from "./components/HeroFluidMinimal.tsx";
export { GLASS_PANEL_DEFAULTS, GLASS_PANEL_PRESETS, GLASS_PANEL_SHADER, GlassPanel, type GlassPanelProps } from "./components/GlassPanel.tsx";
export { GLASS_TILE_DEFAULTS, GLASS_TILE_SHADER, GlassTile, type GlassTileProps } from "./components/GlassTile.tsx";
export { ChromaticText, type ChromaticTextProps } from "./components/ChromaticText.tsx";
export { RippleText, type RippleTextProps } from "./components/RippleText.tsx";
export { SpectrumText, type SpectrumTextProps } from "./components/SpectrumText.tsx";
export { TiltCard, type TiltCardProps } from "./components/TiltCard.tsx";
export { PointerGlow, type PointerGlowProps } from "./components/PointerGlow.tsx";
export { SpotlightCard, type SpotlightCardProps } from "./components/SpotlightCard.tsx";
export { ElasticHover, type ElasticHoverProps } from "./components/ElasticHover.tsx";
export { MagneticGrid, type MagneticGridProps } from "./components/MagneticGrid.tsx";
export { BlockLogos, type BlockLogosProps, type LogoItem } from "./components/BlockLogos.tsx";
export { BlockStats, type BlockStatsProps, type StatItem } from "./components/BlockStats.tsx";
export { BlockTeam, type BlockTeamProps, type TeamLink, type TeamMember } from "./components/BlockTeam.tsx";
export { BlockGallery, type BlockGalleryProps, type GalleryItem } from "./components/BlockGallery.tsx";
export { BlockTimeline, type BlockTimelineProps, type TimelineEvent } from "./components/BlockTimeline.tsx";
export { BlockNewsletter, type BlockNewsletterProps } from "./components/BlockNewsletter.tsx";
export { BlockContact, type BlockContactProps, type ContactChannel, type ContactField } from "./components/BlockContact.tsx";
export { BlockBanner, type BlockBannerProps } from "./components/BlockBanner.tsx";
export { BlockMilestones, type BlockMilestonesProps, type Milestone } from "./components/BlockMilestones.tsx";
export { BlockQuoteWall, type BlockQuoteWallProps, type WallQuote } from "./components/BlockQuoteWall.tsx";
