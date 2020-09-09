<!-- Copy and paste the converted output. -->

<!-----
NEW: Check the "Suppress top comment" option to remove this info from the output.

Conversion time: 8.322 seconds.


Using this Markdown file:

1. Paste this output into your source file.
2. See the notes and action items below regarding this conversion run.
3. Check the rendered output (headings, lists, code blocks, tables) for proper
   formatting and use a linkchecker before you publish this page.

Conversion notes:

* Docs to Markdown version 1.0β29
* Wed Sep 02 2020 13:37:41 GMT-0700 (PDT)
* Source doc: Sentinel_RTC_ATBD_v3.1
* Tables are currently converted to HTML tables.

WARNING:
You have some equations: look for ">>>>>  gd2md-html alert:  equation..." in output.

* This document has images: check for >>>>>  gd2md-html alert:  inline image link in generated source and store images to your server. NOTE: Images in exported zip file from Google Docs may not appear in  the same order as they do in your doc. Please check the images!


WARNING:
You have 6 H1 headings. You may want to use the "H1 -> H2" option to demote all headings by one level.

----->


<p style="color: red; font-weight: bold">>>>>>  gd2md-html alert:  ERRORs: 0; WARNINGs: 2; ALERTS: 22.</p>
<ul style="color: red; font-weight: bold"><li>See top comment block for details on ERRORs and WARNINGs. <li>In the converted Markdown or HTML, search for inline alerts that start with >>>>>  gd2md-html alert:  for specific instances that need correction.</ul>

<p style="color: red; font-weight: bold">Links to alert messages:</p><a href="#gdcalert1">alert1</a>
<a href="#gdcalert2">alert2</a>
<a href="#gdcalert3">alert3</a>
<a href="#gdcalert4">alert4</a>
<a href="#gdcalert5">alert5</a>
<a href="#gdcalert6">alert6</a>
<a href="#gdcalert7">alert7</a>
<a href="#gdcalert8">alert8</a>
<a href="#gdcalert9">alert9</a>
<a href="#gdcalert10">alert10</a>
<a href="#gdcalert11">alert11</a>
<a href="#gdcalert12">alert12</a>
<a href="#gdcalert13">alert13</a>
<a href="#gdcalert14">alert14</a>
<a href="#gdcalert15">alert15</a>
<a href="#gdcalert16">alert16</a>
<a href="#gdcalert17">alert17</a>
<a href="#gdcalert18">alert18</a>
<a href="#gdcalert19">alert19</a>
<a href="#gdcalert20">alert20</a>
<a href="#gdcalert21">alert21</a>
<a href="#gdcalert22">alert22</a>

<p style="color: red; font-weight: bold">>>>>> PLEASE check and correct alert issues and delete this message and the inline alerts.<hr></p>


**ASF Radiometric Terrain Corrected Products**

Sentinel-1 Algorithm Theoretical Basis Document

The Alaska Satellite Facility

**ABSTRACT**

This document provides the theoretical background of the algorithms and processing flows used for the generation of Sentinel-1 terrain corrected products processed at the Alaska Satellite Facility.




# Document preparation

The document was prepared with contributions from

Rudi Gens

Heidi Kristenson

Tom Logan

Jeremy Nicoll


# Document change log


<table>
  <tr>
   <td><strong>Revision</strong>
   </td>
   <td><strong>Date</strong>
   </td>
   <td><strong>Page</strong>
   </td>
   <td><strong>Change Description</strong>
   </td>
   <td><strong>Reason for change</strong>
   </td>
  </tr>
  <tr>
   <td>1.0 Draft
   </td>
   <td>07/01/2014
   </td>
   <td>all
   </td>
   <td>Initial Draft
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>1.1
   </td>
   <td>01/15/2015
   </td>
   <td>all
   </td>
   <td>More detailed description of the algorithm
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>1.2
   </td>
   <td>06/01/2015
   </td>
   <td>all
   </td>
   <td>Added more detail on the processing flow
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>2.0
   </td>
   <td>06/07/2018
   </td>
   <td>all
   </td>
   <td>Updated document to describe Sentinel processing
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>2.1
   </td>
   <td>9/26/2018
   </td>
   <td>all
   </td>
   <td>Added DEM posting; fixed file types
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>2.2
   </td>
   <td>10/01/2018
   </td>
   <td>all
   </td>
   <td>JBN Review
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>2.3
   </td>
   <td>10/05/2018
   </td>
   <td>all
   </td>
   <td>HJK Review; Added gridding section; Updated calibration section
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>3.0
   </td>
   <td>07/20/2020
   </td>
   <td>all
   </td>
   <td>Updated for 2020 Standard RTC products
   </td>
   <td>HyP3 Standard Product release through Vertex
   </td>
  </tr>
  <tr>
   <td>3.1
   </td>
   <td>08/05/2020
   </td>
   <td>all
   </td>
   <td>HJK Review; Added pixel as point reference; Added customizable products
   </td>
   <td>
   </td>
  </tr>
</table>


**Table of Contents**


[TOC]



# 
    


# 
    Document structure

The document is structured as follows:

Chapter 1 introduces the structure and scope of the document.

Chapter 2 provides background information about SAR imagery, Sentinel-1 calibration, and digital elevation models.

Chapter 3 reviews the theoretical background of radiometric terrain correction.

Chapter 4 shows the processing flow for generating terrain corrected Sentinel-1 products. Details are provided about co-registration, the radiometric terrain correction and products generated.





1. Introduction and scope

The side-looking geometry of SAR imagery leads to geometric and radiometric distortions. This causes foreshortening, layover, shadowing, and radiometric variations due to the slope that make any further analysis difficult (Shimada, 2010).

Radiometric terrain correction improves backscatter estimates that can be used as input for applications such as the monitoring of deforestation, land-cover classification, and delineation of wet snow-covered areas (Small, 2011).

This Algorithm Theoretical Basis Document (ATBD) describes the basic algorithms of radiometric terrain correction using the Gamma Remote Sensing software.

The document will not describe the product specification, data format, and product planning. It will not provide any details of the implementation of the algorithms used.



2. Background
    1. SAR images

The primary data source for generating geometrically and radiometrically corrected data products is the Sentinel-1 imagery acquired during the Sentinel-1 mission (2014-present). The terrain correction products can be generated for all beam modes using either GRD or SLC image formats.   Both Sentinel-1A and Sentinel-1B products can be terrain corrected.



    2. Calibration

The objective of the calibration of SAR data is to provide imagery in which the pixel values can be directly related to the radar backscatter of the scene. It allows for quantitative analysis of the imagery and comparison between images.

In order to derive geophysical parameters from SAR data, Freeman (1992) established calibration requirements. The specification for 

<p id="gdcalert1" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: equation: use MathJax/LaTeX if your publishing platform supports it. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert2">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

absolute calibration is ±1 dB with the long-term relative calibration ±0.5 dB and the short-term relative calibration less than 0.5 dB.

Calibrating a SAR image is the process of converting a linear amplitude image into a radiometrically calibrated power image. The input image is in units of digital numbers (DNs), whereas the output image is in units of β<sub>0</sub>, ϒ<sub>0,</sub> or σ<sub>0</sub>, which is the ratio of the power that comes back from a patch of ground to power sent to the patch of ground (Figure 1). 

The application requirements will help determine which of these calibration units to choose. If quantitative measurements referenced to the ground are required, σ<sub>0</sub> values should be used.  For calibration purposes, γ<sub>0</sub> values are preferred because they are equally spaced. Finally, β<sub>0</sub> values are independent from the observed terrain.  Values generated in the terrain correction process default to γ<sub>0</sub>.  Converting values from γ<sub>0 </sub>to σ<sub>0</sub> and β<sub>0</sub> requires the incidence angle θ:


            

<p id="gdcalert2" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: equation: use MathJax/LaTeX if your publishing platform supports it. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert3">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

	(1)

Schwerdt _et al._ (2016, 2017) summarized their assessment of the radiometric and geometric calibration of Sentinel-1A and Sentinel-1B data using two types of calibration point targets to determine the calibration factor relating the DNs to normalized a radar cross section (NRCS).   Both C-band transponders and trihedral corner reflectors were used to compare actual point target analysis measurements with known radar cross sections.

The NRCS can be calculated using one of three different calibration look up tables producing either  

<p id="gdcalert3" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: equation: use MathJax/LaTeX if your publishing platform supports it. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert4">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

with the following equation:


            

<p id="gdcalert4" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: equation: use MathJax/LaTeX if your publishing platform supports it. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert5">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

 	(2)

The Schwerdt et al. analysis determined an absolute radiometric accuracy of 0.43 dB for Sentinel-1A, 0.36 dB for Sentinel-1B, and a cross-check between the systems showed an accuracy of 0.38 dB.



    3. Digital elevation models

The correction of the geometric distortions as well as the related radiometry adjustment of SAR imagery requires the use of digital elevation models (DEMs). The accuracy of a terrain corrected result is directly related to the quality of the DEM.



<p id="gdcalert5" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image1.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert6">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image1.png "image_tooltip")



        **Figure 2: 	Four different sources of DEMs are used for the terrain correction. Note high resolution DEMs are not available for Greenland, Eurasia above 60 degrees northern latitude, and Antarctica.**

Figure 2 shows the coverage of DEMs used for the terrain correction, provided by the United States Geological Survey (USGS). The Shuttle Radar Topography Mission (SRTM) data is globally available at a resolution of 30 m between 60 degrees northern and southern latitude. North America is covered by a variety of digital elevation models. For Canada and Mexico a National Elevation Dataset (NED) at a resolution of 1 arc-second is used. Alaska is generally covered with NED 2 arc-second resolution data as well as SRTM data at 30 m below 60 degrees northern latitude. The USGS provided data for some parts of Alaska and the contiguous United States (CONUS) at a ⅓ arc-second level.

The SRTM GL1 data showed a number of artifacts that needed to be corrected. In order to detect the anomalies, the slope to the neighboring pixel was calculated in both image directions. Any absolute local slope greater than 400 m was marked as anomaly. The spikes and holes forming the anomalies in the DEM were removed by adaptive triangulation using the Quick Terrain Modeler software.

The accuracy of these various DEM sources was analyzed by Gesch _et al._ (2014), comparing the DEM with reference data in the form of geodetic control points of the National Geodetic Survey (NGS). The results are summarized in Table 1.


<table>
  <tr>
   <td><strong>DEM Source</strong>
   </td>
   <td><strong>RMSE [m]</strong>
   </td>
  </tr>
  <tr>
   <td>CONUS ⅓ arc-second
   </td>
   <td>1.55
   </td>
  </tr>
  <tr>
   <td>CONUS 1 arc-second
   </td>
   <td>2.44
   </td>
  </tr>
  <tr>
   <td>Alaska 2 arc-second
   </td>
   <td>4.85
   </td>
  </tr>
  <tr>
   <td>Canada 1 arc-second
   </td>
   <td>3.64
   </td>
  </tr>
  <tr>
   <td>Mexico 1 arc-second
   </td>
   <td>6.74
   </td>
  </tr>
</table>


**Table 1:  Absolute vertical accuracy of the various NED sources (Gesch _et al._, 2014)**

The comparison of 1 arc-second NED with other large-area elevation datasets showed the following accuracies (Table 2):


<table>
  <tr>
   <td><strong>DEM Source</strong>
   </td>
   <td><strong>RMSE [m]</strong>
   </td>
  </tr>
  <tr>
   <td>NED 1 arc-second
   </td>
   <td>1.84
   </td>
  </tr>
  <tr>
   <td>SRTM 30 m
   </td>
   <td>4.01
   </td>
  </tr>
  <tr>
   <td>ASTER GDEM 30 m
   </td>
   <td>8.68
   </td>
  </tr>
</table>


**Table 2: Accuracy assessment of large-area elevation datasets (Gesch _et al._, 2014)**

The DEMs are organized and assembled as virtual raster mosaics from which the necessary subsets are extracted that cover the relevant areas for the terrain correction. The DEM values are geoid corrected.  When DEMs are extracted for scenes to be processed, they are created at a 30-meter posting.  Thus they all line up on the same grid automatically.





3. Radiometric Terrain Correction

Radiometric terrain correction addresses two aspects of adjusting the effects of side-looking geometry of SAR imagery. First, the geometric distortions are corrected by using a digital elevation model. Second, the brightness, or radiometry, is adjusted in the affected foreshortening and layover regions.

Small (2011) comprehensively reviewed the various techniques for radiometric terrain correction and concluded that the pixel-area integration approach is the most robust technique available to radiometrically normalize SAR imagery.

Figure 3 (Frey _et al._, 2013) provides the geometric definitions for the illuminated area. 

<p id="gdcalert6" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: equation: use MathJax/LaTeX if your publishing platform supports it. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert7">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

 is the range vector in the line of sight. 

<p id="gdcalert7" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: equation: use MathJax/LaTeX if your publishing platform supports it. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert8">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

 is pointing in the azimuth direction. 

<p id="gdcalert8" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: equation: use MathJax/LaTeX if your publishing platform supports it. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert9">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

 is the ellipsoid normal vector. 

<p id="gdcalert9" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: equation: use MathJax/LaTeX if your publishing platform supports it. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert10">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

 is the vector normal to the image plane, the normalized cross product of 

<p id="gdcalert10" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: equation: use MathJax/LaTeX if your publishing platform supports it. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert11">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

 and 

<p id="gdcalert11" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: equation: use MathJax/LaTeX if your publishing platform supports it. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert12">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

. 

<p id="gdcalert12" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: equation: use MathJax/LaTeX if your publishing platform supports it. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert13">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

 is the normalized surface normal vector. 

<p id="gdcalert13" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: equation: use MathJax/LaTeX if your publishing platform supports it. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert14">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

 is the ellipsoid-based incidence angle. 

<p id="gdcalert14" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: equation: use MathJax/LaTeX if your publishing platform supports it. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert15">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

 is the local incidence angle. Finally, 

<p id="gdcalert15" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: equation: use MathJax/LaTeX if your publishing platform supports it. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert16">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

 is the projection angle that relates the unit image area to the unit ground area when using the projection cosine approach.

The pixel-area integration for the radiometric normalization adjusts the brightness of the individual SAR image pixels, particularly in layover regions, by determining the actual area on the ground that the SAR signal was backscattered from. The average backscatter coefficient σ<sub>0</sub> is calculated by



<p id="gdcalert16" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: equation: use MathJax/LaTeX if your publishing platform supports it. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert17">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

,**	**(3)

using the radar brightness β<sub>0</sub>, the ellipsoid reference area 

<p id="gdcalert17" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: equation: use MathJax/LaTeX if your publishing platform supports it. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert18">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

, and the illuminated topographic pixel area 

<p id="gdcalert18" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: equation: use MathJax/LaTeX if your publishing platform supports it. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert19">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

 (Frey et al., 2013).

The radar brightness β<sub>0</sub> is the ratio of the radar backscatter β and the reference area A<sub>β</sub> (Small, 2011).

For a better approximation of the area integral, the digital elevation model is divided into rectangular regions that are then subdivided into two triangular facets (Figure 5). The surface normal is defined for these triangular facets. Based on the geometry relative to the radar look vector (Figure 6), the projected pixel area of the facet is determined and added to the pixel-area map in range-Doppler coordinates.


<table>
  <tr>
   <td>

<p id="gdcalert19" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image2.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert20">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


<img src="images/image2.png" width="" alt="alt_text" title="image_tooltip">

   </td>
   <td>

<p id="gdcalert20" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image3.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert21">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


<img src="images/image3.png" width="" alt="alt_text" title="image_tooltip">

   </td>
  </tr>
  <tr>
   <td><strong>Figure 5: 	Digital height model facet 	neighborhood (Source: Small, 2011)</strong>
   </td>
   <td><strong>Figure 6: 	Projection of digital elevation facets 	into viewing plane (Source: Small, 	2011)</strong>
   </td>
  </tr>
</table>


In Gamma's implementation of this approach, summarized in Figure 7, each triangular facet is further divided into a number of rectangles that are then integrated into the correct range bin using the same surface normal defined for the triangle. 



<p id="gdcalert21" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image4.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert22">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image4.png "image_tooltip")


**Figure 7: Processing flow for area integration calculation**





4. Processing flow

The terrain corrected products are derived from either Sentinel-1 Single Look Complex (SLC) or Ground Range Detected (GRD) products generated by the Sentinel-1 Instrument Processing Facility (IPF).



    4. Co-registration

In the past, the geolocation quality of the terrain corrected products depended largely on matching the SAR image with a simulated image derived from the DEM during a co-registration process included in the SAR-Simulation Terrain Correction Algorithm (Bayanudin, 2016).  This was due to the inaccuracy of the state vectors provided with earlier products.

For the Sentinel platforms, the location of the satellite can be determined to within a few centimeters using a Range-Doppler terrain correction method.  Thus, by using the geometric relationship of the satellite and the earth, the imaging swath location is known to a similar accuracy.  This approach, also called dead reckoning, relies entirely on the quality of the orbit information provided with the products.  By default, no co-registration is used to create the ASF Sentinel-1 RTC images, although there is still the option to use DEM matching for custom-ordered HyP3 imagery, if desired.



    5. 
Product spacing and resolution
In order to create a product with a requested pixel spacing, multi-looking is used.  Multi-look images are generated by averaging over range and/or azimuth pixels  The process removes speckle, but degrades spatial resolution. The resulting images will have less noise and approximately square pixel spacing. Moreover, after multi-looking, the data will be at the requested pixel spacing after being converted from slant range to ground range.

For the generation of the 30-m RTC products created from GRD inputs, SAR the image is first multi-looked 6x6 to produce an intermediate product that is 60 meters in posting and resolution.  This image is then terrain corrected onto a 30 meter grid in the DEM output space, resulting in products that have a resolution of 60 meters and a grid spacing of 30 meters.  For 10-m RTC products created from ground range detected inputs, no additional multi-looking is performed.  Both product resolution and spacing are preserved (20 meters and 10 meters respectively).

For RTC products derived from SLC inputs, the data is multi-looked 15x3 giving a product that also has roughly 60-meter resolution, and then terrain corrected onto a 30 meter grid.  For 10-m RTC products derived from SLC inputs, the data is multi-looked 5x1 giving a product that has roughly 20-meter resolution, and then terrain corrected onto a 10 meter grid.   



    6. 
Radiometric terrain correction
The adjustment of the radar brightness β<sup>0<strong> </strong></sup>is determined by multiplying it by the ratio of pixel area from the ellipsoidal reference A<sub>β<strong> </strong></sub>over the integrated pixel area A<sub>γ</sub>


<table>
  <tr>
   <td>
   </td>
   <td>(4)
   </td>
  </tr>
</table>


A side product of the illuminated topographic pixel area calculation is the local incidence angle map.

The inversion of the mapping function used to establish the relation between SAR geometry and the DEM in map-projected space is used to terrain correct and geocode the radiometrically corrected SAR image.



    7. DEM Gridding

All Sentinel RTC products are placed on the same grid during processing so they will be pixel aligned when created.  As a result, no resampling will be required to compare one RTC product to another.  This is accomplished by “snapping” the corner coordinates to a regular 30-meter grid that starts at UTM coordinates (0,0).  When images are turned into geotiffs, they are written as pixel-as-point data (Open GeoTIFF standard 2019).  



    8. Product generation

RTC products will be generated at 30 a meter pixel spacing by default. The layover/shadow mask, incidence angle map and reference DEM included with the product match the pixel spacing of the RTC products.

Standard RTC products are geocoded to the Universal Transverse Mercator (UTM) projection and provided as floating-point values in GeoTIFF format. The reference for the RTC products is pixel as point. The products are output in 

<p id="gdcalert22" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: equation: use MathJax/LaTeX if your publishing platform supports it. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert23">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>

 radiometric projection in power scale.

 \



## 4.6  Customizable Products

ASF will release a version of HyP3 that includes the ability to customize products after the initial “standard products” release (slated for fall 2020).  Table 3 describes the options that will become available.  Product customizations will be reported in the filenames of each product.  See the [Sentinel-1 RTC User Guide](https://asf.alaska.edu/wp-content/uploads/2019/02/Sentinel_RTC_Users_Guide.pdf) for the file naming convention.


<table>
  <tr>
   <td><strong>Parameter</strong>
   </td>
   <td><strong>Default</strong>
   </td>
   <td><strong>Option</strong>
   </td>
   <td><strong>Description</strong>
   </td>
  </tr>
  <tr>
   <td><strong>DEM Matching</strong>
   </td>
   <td>No matching (Range-Doppler correction)
   </td>
   <td>Matching (SAR-Simulation correction)
   </td>
   <td>DEM matching may be used instead of   dead reckoning (default)
   </td>
  </tr>
  <tr>
   <td><strong>Filter</strong>
   </td>
   <td>Do not apply a speckle filter
   </td>
   <td>Apply Enhanced Lee speckle filter
   </td>
   <td>Enhanced Lee speckle filter may be applied to remove speckle while preserving edges
   </td>
  </tr>
  <tr>
   <td><strong>Radiometry</strong>
   </td>
   <td>γ<sub>0</sub> 
   </td>
   <td>σ<sub>0</sub> 
   </td>
   <td>Output product in σ<sub>0</sub> instead of γ<sub>0</sub> 
   </td>
  </tr>
  <tr>
   <td><strong>Resolution</strong>
   </td>
   <td>30m
   </td>
   <td>10m
   </td>
   <td>Output product with 10 meter pixel spacing instead of 30 meter
   </td>
  </tr>
  <tr>
   <td><strong>Scale</strong>
   </td>
   <td>Power
   </td>
   <td>Amplitude
   </td>
   <td>Convert power to amplitude by taking the square root of the power values
   </td>
  </tr>
</table>


**Table 3: Customizable Options**


# 
    


# 
    References


    Bayanudin, A.A. & Jatmiko, R.H., 2016. Orthorectification of Sentinel-1 SAR (Synthetic Aperture Radar) Data in Some Parts Of South-eastern Sulawesi Using Sentinel-1 Toolbox. IOP Conference Series: Earth and Environmental Science, 47, p.012007. Available at: http://dx.doi.org/10.1088/1755-1315/47/1/012007.


    Freeman, A., 1992. SAR calibration: an overview. IEEE Transactions on Geoscience and Remote Sensing, 30(6), pp.1107–1121. Available at: http://dx.doi.org/10.1109/36.193786.


    Frey, O. et al., 2013. DEM-Based SAR Pixel-Area Estimation for Enhanced Geocoding Refinement and Radiometric Normalization. IEEE Geoscience and Remote Sensing Letters, 10(1), pp.48–52. Available at: http://dx.doi.org/10.1109/lgrs.2012.2192093.


    Gesch, D.B., Oimoen, M.J. & Evans, G.A., 2014. Accuracy assessment of the U.S. Geological Survey National Elevation Dataset, and comparison with other large-area elevation datasets: SRTM and ASTER. Open-File Report. Available at: http://dx.doi.org/10.3133/ofr20141008.


    Open GeoTIFF Standard 2019, _Raster Space_ _B22, _Open Geospatial Consortium, accessed 4 August 2020,  &lt;[http://docs.opengeospatial.org/is/19-008r4/19-008r4.html#_raster_space](http://docs.opengeospatial.org/is/19-008r4/19-008r4.html#_raster_space)>


    Schwerdt, M. et al., 2014. Independent verification of the Sentinel-1A system calibration. 2014 IEEE Geoscience and Remote Sensing Symposium. Available at: http://dx.doi.org/10.1109/igarss.2014.6946620.


    Schwerdt, M. et al., 2017. Independent System Calibration of Sentinel-1B. Remote Sensing, 9(6), p.511. Available at: http://dx.doi.org/10.3390/rs9060511.


    Shimada, M., 2010. Ortho-Rectification and Slope Correction of SAR Data Using DEM and Its Accuracy Evaluation. IEEE Journal of Selected Topics in Applied Earth Observations and Remote Sensing, 3(4), pp.657–671. Available at: http://dx.doi.org/10.1109/jstars.2010.2072984.


    Small, D., 2011. Flattening Gamma: Radiometric Terrain Correction for SAR Imagery. IEEE Transactions on Geoscience and Remote Sensing, 49(8), pp.3081–3093. Available at: http://dx.doi.org/10.1109/tgrs.2011.2120616.
